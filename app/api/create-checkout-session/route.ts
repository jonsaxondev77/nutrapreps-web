import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/lib/store/cartSlice';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe secret key not configured.' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {});

    const session = await getServerSession(authOptions);

    if (!session?.user?.jwtToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // NEW: Check ordering status on the backend
    const orderingStatusResponse = await fetch(`${apiUrl}/settings/ordering-status`, {
      headers: { 'Authorization': `Bearer ${session.user.jwtToken}` }
    });
    const { isOrderingEnabled } = await orderingStatusResponse.json();

    if (!isOrderingEnabled) {
      return NextResponse.json({ error: 'Ordering is currently disabled.' }, { status: 403 });
    }
    
    let baseShippingCost = 0;
    let stripeCustomerId = null;
    try {
      const shippingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/shipping-details`, {
        headers: { 'Authorization': `Bearer ${session.user.jwtToken}` }
      });
      if (shippingResponse.ok) {
        const shippingData = await shippingResponse.json();
        baseShippingCost = shippingData.cost;
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

      // NEW: Add a line item for each meal with a supplement
      const allMeals = [...item.meals.sunday, ...item.meals.wednesday].filter(Boolean);
      allMeals.forEach(mealOption => {
        const supplementPrice = parseFloat(mealOption!.meal.supplement);
        if (supplementPrice > 0) {
            line_items.push({
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: `${mealOption!.meal.name} (Supplement)`,
                        description: 'Meal Supplement',
                    },
                    unit_amount: Math.round(supplementPrice * 100),
                },
                quantity: 1,
            });
        }
      });

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

    const isDualDelivery = cartItems.some((item: CartItem) => item.deliveryDays === "Both");

    const shippingCost = isDualDelivery ? baseShippingCost * 2 : baseShippingCost;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout`,
      metadata: {
        order_id: orderId,
      },
      allow_promotion_codes: true,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shippingCost * 100),
              currency: 'gbp',
            },
            display_name: isDualDelivery ? 'Dual Delivery' : 'Standard Delivery',
          },
        }
      ],
    };

    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
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