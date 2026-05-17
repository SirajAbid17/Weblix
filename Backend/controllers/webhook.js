import stripe from "../config/stripe.js";
import User from "../models/user.js";
import { Plans } from "../config/Plan.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
       
        const userId = session.metadata.userId;
        const planType = session.metadata.planType;
        const creditsToAdd = parseInt(session.metadata.credits);
        const plan = session.metadata.plan;
        const price = parseInt(session.metadata.price);

        const user = await User.findById(userId);
        
        if (!user) {
          console.error(`User not found: ${userId}`);
          return res.status(404).send('User not found');
        }

        const oldCredits = user.credits || 0;
        
        user.credits = (user.credits || 0) + creditsToAdd;
       
        if (!user.paymentHistory) {
          user.paymentHistory = [];
        }
        
        user.paymentHistory.push({
          stripeSessionId: session.id,
          planType: planType,
          amount: price,
          credits: creditsToAdd,
          purchasedAt: new Date(),
          status: 'completed'
        });
        
       
        user.subscription = {
          plan: plan,
          planType: planType,
          credits: creditsToAdd,
          totalCredits: user.credits,
          purchasedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
          stripeSessionId: session.id,
          status: 'active',
          lastPaymentDate: new Date()
        };
        
        await user.save();
        
      
        
        
      } catch (error) {
        console.error('Error updating user credits:', error);
        return res.status(500).send('Error processing webhook');
      }
      break;
      
    case 'checkout.session.expired':
      console.log('Checkout session expired:', event.data.object.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};