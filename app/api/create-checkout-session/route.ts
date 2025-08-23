import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/lib/store/cartSlice';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(request: Request) {
  try {
    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    cartItems.forEach((item: CartItem) => {
      if (item.plan) {
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

      const allAddons = [...item.addons.sunday, ...item.addons.wednesday];
      allAddons.forEach(addon => {
        if (addon.quantity > 0) {
          line_items.push({
            price_data: {
              currency: 'gbp',
              product_data: {
                name: addon.item.name,
                description: 'Add-on',
              },
              unit_amount: Math.round(addon.item.price * 100),
            },
            quantity: addon.quantity,
          });
        }
      });
      
      item.desserts.forEach(dessert => {
         if (dessert.quantity > 0) {
          line_items.push({
            price_data: {
              currency: 'gbp',
              product_data: {
                name: dessert.item.name,
                description: 'Dessert',
              },
              unit_amount: Math.round(dessert.item.price * 100),
            },
            quantity: dessert.quantity,
          });
        }
      });
    });
    
     line_items.push({
        price_data: {
            currency: 'gbp',
            product_data: {
                name: 'Shipping',
            },
            unit_amount: 500, // £5.00
        },
        quantity: 1,
    });


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
