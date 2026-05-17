import { Plans } from "../config/Plan.js";
import stripe from "../config/stripe.js";
import User from "../models/user.js";

export const Billing = async (req, res) => {
  try {
    const { plantype } = req.body;
    const userid = req.user._id;

    const plan = Plans[plantype];

    if (!plan) {
      return res.status(400).json({
        message: "Invalid plan type",
      });
    }

  
    if (plantype === "free") {
      return res.status(200).json({
        message: "Free plan selected",
        redirectUrl: `${process.env.FRONTEND_URL}/dashboard`
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: `${plan.credits} credits`,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=${plantype}&credits=${plan.credits}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: userid.toString(),
        planType: plantype,
        credits: plan.credits.toString(),
        plan: plan.plan,
        price: plan.price.toString()
      },
    });

    return res.status(200).json({
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("Billing error:", error);
    return res.status(500).json({
      message: "Billing error",
      error: error.message,
    });
  }
};


export const ConfirmPayment = async (req, res) => {
  try {
    const { session_id, plan, credits } = req.query;
    const userId = req.user._id;

    console.log("Payment confirmation request:", { session_id, plan, credits, userId });

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "Session ID required"
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    console.log("Stripe session status:", session.payment_status);
    
    if (session.payment_status === 'paid') {
     
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      const creditsToAdd = parseInt(credits);
      const oldCredits = user.credits || 0;
      
      console.log(`Credits: Old=${oldCredits}, Adding=${creditsToAdd}, New=${oldCredits + creditsToAdd}`);
    
      user.credits = oldCredits + creditsToAdd;
      
      if (!user.paymentHistory) {
        user.paymentHistory = [];
      }
    
      const alreadyProcessed = user.paymentHistory.some(
        p => p.stripeSessionId === session_id
      );
      
      if (alreadyProcessed) {
        console.log("Session already processed:", session_id);
        return res.status(200).json({
          success: true,
          message: "Payment already processed",
          oldCredits,
          newCredits: user.credits,
          creditsAdded: 0,
          alreadyProcessed: true
        });
      }
      
      
      user.paymentHistory.push({
        stripeSessionId: session_id,
        planType: plan,
        amount: session.amount_total / 100,
        credits: creditsToAdd,
        purchasedAt: new Date(),
        status: 'completed'
      });
      
      await user.save();
      
      console.log(`Credits added successfully! New total: ${user.credits}`);
      
      return res.status(200).json({
        success: true,
        message: "Payment confirmed! Credits added successfully.",
        oldCredits,
        newCredits: user.credits,
        creditsAdded: creditsToAdd
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed"
      });
    }
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error confirming payment",
      error: error.message
    });
  }
};


export const GetUserCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      credits: user.credits || 0,
      plan: user.plan || 'free'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching credits"
    });
  }
};