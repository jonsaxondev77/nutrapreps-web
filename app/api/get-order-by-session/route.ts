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

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required.' }, { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId as string);
    const orderId = stripeSession.metadata?.order_id;
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID not found in session metadata.' }, { status: 404 });
    }

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${session.user.jwtToken}`);
    headers.append('Content-Type', 'application/json');

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/confirmation/${orderId}`;
 
    const orderResponse = await fetch(backendUrl, {
        method: 'GET',
        headers: headers,
    });

    if (!orderResponse.ok) {
        const errorBody = await orderResponse.text();
        return NextResponse.json({ error: 'Failed to fetch order details from backend.' }, { status: orderResponse.status });
    }

    const orderData = await orderResponse.json();

    return NextResponse.json(orderData);

  } catch (error) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
