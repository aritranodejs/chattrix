import twilio from 'twilio';
import Stripe from 'stripe';

// Twilio Credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Stripe 
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const sendSmsOtp = async (to, message, from = process.env.TWILIO_PHONE_NUMBER) => {
    try {
        const client = twilio(accountSid, authToken);
        const messageResponse = await client.messages.create({
            body: message,
            to: to,
            from: from
        });
        return messageResponse.sid;
    } catch (error) {
        throw new Error(error?.message);
    }
};

export const sendVoiceOTP = async (to, message, from = process.env.TWILIO_PHONE_NUMBER) => {
    try {
        const client = twilio(accountSid, authToken);
        // Create the TwiML response
        let twiml = '<Response>';
        for (let i = 0; i < 3; i++) {
            twiml += `<Say>${message}</Say>`;
        }
        twiml += `<Say>Good Bye</Say>`;
        twiml += '</Response>';
        const response = await client.calls.create({
            twiml: twiml,
            to: to,
            from: from
        });
        return response;
    } catch (error) {
        throw new Error(error?.message);
    }
};

export const getPlaceData = async (address) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
    const data = await response.json();

    return data;
};

export const getImage = async (photoreference) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    let path = '';
    if (photoreference == '') {
        path = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=&key=${apiKey}`;
    } else {
        path = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photoreference}&key=${apiKey}`;
    }

    return path;
};

export const stripeRefund = async (paymentIntent) => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntent
        });
        return refund;
    } catch (error) {
        throw new Error(error?.message);
    }
};

export {
    sendSmsOtp,
    sendVoiceOTP,
    getPlaceData,
    getImage,
    stripeRefund
};