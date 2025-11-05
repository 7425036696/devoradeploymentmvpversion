import mongoose from "mongoose";
import { RateLimiterMongo } from "rate-limiter-flexible";
import { auth } from "@clerk/nextjs/server";
export async function getUsageTracker() {
    const {has} = await auth();
    const hasPremiumAccess = has({plan: "pro"});

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
    const usageTracker = new RateLimiterMongo({
        storeClient: mongoose.connection.getClient(), // ✅ pass MongoDB client
        tableName: "Usage",
        points: hasPremiumAccess ? 50 : 5,
        duration: 30 * 24 * 60 * 60
    });

    return usageTracker;
}
export async function consumeCredits() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }
    const usageTracker = await getUsageTracker();
    const result = await usageTracker.consume(userId, 1);
    return result
}
export async function getUsageStatus() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }
    const usageTracker = await getUsageTracker();
    const result = await usageTracker.get(userId);
    return result
}