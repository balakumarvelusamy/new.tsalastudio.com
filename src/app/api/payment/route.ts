import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getItemsByType } from '../../../services/api';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Legacy support: extract 'data' from body if present, or use body as is if keys are at top
        const payload = body.data || body;
        const { amount, currency = "INR" } = payload;

        console.log("Payment API Called (Local Refactor). Payload:", JSON.stringify(payload));

        // 1. Fetch account config to get keys
        const accountConfig = await getItemsByType('accountconfig');

        if (!accountConfig || accountConfig.length === 0) {
            console.error("Razorpay configuration not found in accountconfig.");
            throw new Error("Razorpay configuration not found.");
        }

        const configItem = accountConfig[0];
        const RAZORPAY_KEY_ID = configItem.key_id_test?.trim();
        const RAZORPAY_KEY_SECRET = configItem.key_secret_test?.trim();

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
            console.error("Razorpay keys missing in config:", JSON.stringify(configItem));
            throw new Error("Razorpay keys missing in configuration.");
        }

        // 2. Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
        });

        // 3. Create Order
        const receipt = "receipt_" + Math.random().toString(36).substring(7);
        const order = await razorpay.orders.create({
            amount: amount, // Amount should be in paise
            currency: currency,
            receipt: receipt,
            // Add other options if passed in payload?
        });

        console.log("Order Created Successfully:", order.id);

        // 4. Return Response
        // Maintain structure expected by legacy callers if possible
        // The original code returned: return NextResponse.json(responseData); 
        // which was whatever the external API returned.
        // Usually Razorpay order response + maybe our own wrapper.
        // My new /create-order returns { orderId, keyId, receipt }.
        // I will return a merged response to be safe: standard Razorpay order object + key_id for frontend convenience.

        return NextResponse.json({
            ...order,        // properties like id, entity, amount, ...
            order_id: order.id, // redundancy for clarity or legacy mappers
            id: order.id,
            key_id: RAZORPAY_KEY_ID, // Frontend likely needs this
            razororderid: order.id,
            razorreceipt: receipt,
            data: { // Nested data to mimic old structure just in case?
                id: order.id,
                key_id: RAZORPAY_KEY_ID,
                razororderid: order.id,
                razorreceipt: receipt
            },
            status: 200 // Legacy wrapper often included status
        });

    } catch (error: any) {
        console.error("Payment API Error:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            status: 500,
            error: error instanceof Error ? error.message : JSON.stringify(error)
        }, { status: 500 });
    }
}
