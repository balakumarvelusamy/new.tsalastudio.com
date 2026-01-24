import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getItemsByType } from "../../../services/api";

export async function POST(request: NextRequest) {
    try {
        // 1. Fetch account config to get keys
        const accountConfig = await getItemsByType('accountconfig');
        console.log("Account Config Fetch Result:", JSON.stringify(accountConfig));

        if (!accountConfig || accountConfig.length === 0) {
            console.error("Razorpay configuration not found. Result was empty or null.");
            throw new Error("Razorpay configuration not found in accountconfig.");
        }

        const configItem = accountConfig[0];
        // Ensure keys are trimmed to avoid auth errors due to whitespace
        const RAZORPAY_KEY_ID = configItem.key_id_test?.trim();
        const RAZORPAY_KEY_SECRET = configItem.key_secret_test?.trim();

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
            console.error("Razorpay keys missing in config item:", JSON.stringify(configItem));
            throw new Error("Razorpay keys missing in configuration.");
        }
        console.log("bala", RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
        const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
        });

        // Parse body if available to get amount
        let amount = 100 * 100; // Default
        try {
            const body = await request.json();
            if (body.amount) {
                amount = body.amount;
            }
        } catch (e) {
            // Ignore JSON parse error, use default
        }

        const receipt = "receipt_" + Math.random().toString(36).substring(7);

        const order = await razorpay.orders.create({
            amount: amount, // Amount in paise
            currency: "INR",
            receipt: receipt,
        });

        console.log("Order Created:", order.id);

        return NextResponse.json({
            orderId: order.id,
            keyId: RAZORPAY_KEY_ID,
            receipt: receipt // Return receipt for tracking
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error creating order:");
        return NextResponse.json(
            {
                error: `Error creating order: ${error}`,
                details: error
            },
            { status: 500 }
        );
    }
}
