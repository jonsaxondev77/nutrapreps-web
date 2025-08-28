import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/lib/store/cartSlice';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';

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

    let stripeShippingRateId: string | null = null;
    let stripeCustomerId = null;
    try {
      const shippingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/shipping-details`, {
        headers: { 'Authorization': `Bearer ${session.user.jwtToken}` }
      });
      if (shippingResponse.ok) {
        const shippingData = await shippingResponse.json();
        stripeShippingRateId = shippingData.stripeShippingRateId;
      }
    } catch (e) {
      console.error("Could not fetch shipping details:", e);
    }


    try {
      const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/stripe-customer`, {
        headers: {
          'Authorization': `Bearer ${session.user.jwtToken}`
        }
      });
      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        stripeCustomerId = customerData.stripeCustomerId;
        console.log(`[API] SUCCESS: Fetched Stripe Customer ID: ${stripeCustomerId}`);
      } else {
        console.error(`Failed to fetch Stripe Customer ID from backend. Status: ${customerResponse.status}`);
      }
    } catch (e) {
      console.error("Erro fecthing Stripe Customer ID:", e);
    }
    const { cartItems, orderId } = await request.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty or invalid.' }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    cartItems.forEach((item: CartItem) => {
      if (item.plan && typeof item.plan.price === 'number') {
        line_items.push({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${item.plan.name} Box`,
              description: `${item.plan.mealsPerWeek} meals, ${item.deliveryDays} delivery`,
            },
            unit_amount: Math.round(item.plan.price * 100),
          },
          quantity: 1,
        });
      }

      const allAddons = [...(item.addons.sunday || []), ...(item.addons.wednesday || [])];
      allAddons.forEach(addon => {
        if (addon.quantity > 0 && addon.item && typeof addon.item.price === 'number') {
          line_items.push({
            price_data: {
              currency: 'gbp',
              product_data: { name: addon.item.name, description: 'Add-on' },
              unit_amount: Math.round(addon.item.price * 100),
            },
            quantity: addon.quantity,
          });
        }
      });

      (item.desserts || []).forEach(dessert => {
        if (dessert.quantity > 0 && dessert.item && typeof dessert.item.price === 'number') {
          line_items.push({
            price_data: {
              currency: 'gbp',
              product_data: { name: dessert.item.name, description: 'Dessert' },
              unit_amount: Math.round(dessert.item.price * 100),
            },
            quantity: dessert.quantity,
          });
        }
      });
    });


    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout`,
      metadata: {
        order_id: orderId,
      },
      allow_promotion_codes: true
    };

    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
    }

    if (stripeShippingRateId) {
        sessionParams.shipping_options = [{
            shipping_rate: stripeShippingRateId,
        }];
    }

    const stripeSession = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url });

  } catch (error) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
