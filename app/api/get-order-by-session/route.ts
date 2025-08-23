import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions'; // Adjust path as needed

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.jwtToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await request.json();
    console.log(`[API] Received request for session ID: ${sessionId}`); // <-- Added logging

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required.' }, { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId as string);
    const orderId = stripeSession.metadata?.order_id;
    
    console.log(`[API] Retrieved order ID from Stripe metadata: ${orderId}`); // <-- Added logging

    if (!orderId) {
      console.error('[API] Order ID not found in session metadata.'); // <-- Added logging
      return NextResponse.json({ error: 'Order ID not found in session metadata.' }, { status: 404 });
    }

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${session.user.jwtToken}`);
    headers.append('Content-Type', 'application/json');

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/confirmation/${orderId}`;
    console.log(`[API] Fetching order from backend: ${backendUrl}`); // <-- Added logging

    const orderResponse = await fetch(backendUrl, {
        method: 'GET',
        headers: headers,
    });

    if (!orderResponse.ok) {
        const errorBody = await orderResponse.text();
        console.error(`[API] Backend API error (${orderResponse.status}):`, errorBody);
        return NextResponse.json({ error: 'Failed to fetch order details from backend.' }, { status: orderResponse.status });
    }

    const orderData = await orderResponse.json();
    console.log('[API] Successfully fetched order data from backend.'); // <-- Added logging

    return NextResponse.json(orderData);

  } catch (error) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error('[API] Error retrieving order by session:', error);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
