









// const AppDataSource = require("../config/data-source");
// const Plan = require("../entities/Plan");
// const Subscription = require("../entities/Subscription");
// const Invoice = require("../entities/Invoice");
// const User = require("../entities/User");

// // 1. SUBSCRIBE TO PLAN (Common Logic)
// const subscribeToPlan = async (req, res) => {
//     try {
//         const { planId } = req.body;
//         const userId = req.user.id;
//         const subRepo = AppDataSource.getRepository(Subscription);
//         const planRepo = AppDataSource.getRepository(Plan);
//         const invRepo = AppDataSource.getRepository(Invoice);

//         // Check if user already has an active plan
//         const existingSub = await subRepo.findOne({ where: { user: { id: userId }, status: 'active' } });
//         if (existingSub) return res.status(400).json({ message: "Plan already active. Use Upgrade." });

//         const plan = await planRepo.findOneBy({ id: parseInt(planId) });
//         if (!plan) return res.status(404).json({ message: "Plan not found" });

//         const startDate = new Date();
//         let endDate = new Date();
//         plan.duration === 'monthly' 
//             ? endDate.setMonth(startDate.getMonth() + 1) 
//             : endDate.setFullYear(startDate.getFullYear() + 1);

//         const newSub = subRepo.create({ 
//             user: { id: userId }, 
//             plan: { id: planId }, 
//             status: 'active', 
//             startDate, 
//             endDate 
//         });
//         const savedSub = await subRepo.save(newSub);

//         // Generate Invoice for history
//         await invRepo.save({ 
//             user: { id: userId }, 
//             subscription: savedSub, 
//             amount: plan.price, 
//             invoiceNumber: "INV-" + Date.now(), 
//             status: 'Paid' 
//         });

//         res.json({ message: "Subscribed successfully!" });
//     } catch (err) {
//         res.status(500).json({ message: "Subscription failed: " + err.message });
//     }
// };

// // 2. UPGRADE/DOWNGRADE PLAN (Switching Logic)
// const upgradePlan = async (req, res) => {
//     try {
//         const { planId } = req.body;
//         const userId = req.user.id;
//         const subRepo = AppDataSource.getRepository(Subscription);

//         // Pehle active plan ko dhoondo
//         const currentSub = await subRepo.findOne({ where: { user: { id: userId }, status: 'active' } });
        
//         if (currentSub) {
//             // Purane plan ko cancel mark karo (History ke liye)
//             currentSub.status = 'cancelled';
//             await subRepo.save(currentSub);
//         }
        
//         // Naya plan subscribe karwane ke liye common function call karo
//         return subscribeToPlan(req, res);
//     } catch (err) {
//         res.status(500).json({ message: "Upgrade/Downgrade process failed" });
//     }
// };

// // 3. GET MY INVOICES (For TanStack Table)
// const getMyInvoices = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const invRepo = AppDataSource.getRepository(Invoice);

//         const history = await invRepo.createQueryBuilder("invoice")
//             .leftJoinAndSelect("invoice.subscription", "subscription")
//             .leftJoinAndSelect("subscription.plan", "plan")
//             .where("invoice.user = :userId", { userId })
//             .orderBy("invoice.createdAt", "DESC")
//             .getMany();

//         const formattedHistory = history.map(inv => ({
//             id: inv.id,
//             invoiceNumber: inv.invoiceNumber,
//             amount: inv.amount,
//             status: inv.status,
//             subStatus: inv.subscription?.status,
//             planName: inv.subscription?.plan?.name || 'Standard Plan',
//             startDate: inv.subscription?.startDate,
//             endDate: inv.subscription?.endDate
//         }));

//         res.json(formattedHistory);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching history" });
//     }
// };

// // 4. CANCEL SUBSCRIPTION
// const cancelSubscription = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const subRepo = AppDataSource.getRepository(Subscription);
//         const sub = await subRepo.findOne({ where: { user: { id: userId }, status: 'active' } });

//         if (!sub) return res.status(404).json({ message: "No active plan found." });

//         sub.status = 'cancelled';
//         await subRepo.save(sub);
//         res.json({ message: "Subscription cancelled successfully!" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // 5. CLEAR HISTORY
// const clearMyHistory = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const invRepo = AppDataSource.getRepository(Invoice);
//         const subRepo = AppDataSource.getRepository(Subscription);

//         // Delete invoices and non-active subscriptions for this user
//         await invRepo.delete({ user: { id: userId } });
//         await subRepo.delete({ user: { id: userId }, status: 'cancelled' });

//         res.json({ message: "Billing history cleared successfully!" });
//     } catch (err) {
//         res.status(500).json({ message: "Failed to clear history" });
//     }
// };

// // 6. GET OWNER ACTIVE PLAN (For Team Members)
// const getOwnerActivePlan = async (req, res) => {
//     try {
//         const userRepo = AppDataSource.getRepository(User);
//         const subRepo = AppDataSource.getRepository(Subscription);

//         const member = await userRepo.findOne({
//             where: { id: req.user.id },
//             relations: ["owner"]
//         });

//         if (!member || !member.owner) return res.status(404).json({ message: "Owner not found" });

//         const activeSub = await subRepo.findOne({
//             where: { user: { id: member.owner.id }, status: "active" },
//             relations: ["plan"]
//         });

//         res.json({ activePlanName: activeSub ? activeSub.plan.name : null });
//     } catch (err) {
//         res.status(500).json({ message: "Failed to fetch workspace plan" });
//     }
// };

// // ... (Your existing subscribeToPlan, upgradePlan functions)

// // 7. GET ALL SUBSCRIPTIONS (Added for Admin Role Requirement)
// const getAllSubscriptions = async (req, res) => {
//     try {
//         const subRepo = AppDataSource.getRepository(Subscription);
//         const allSubs = await subRepo.find({
//             relations: ["user", "plan"],
//             order: { createdAt: "DESC" }
//         });
//         res.json(allSubs);
//     } catch (err) {
//         res.status(500).json({ message: "Admin access failed: " + err.message });
//     }
// };

// module.exports = {
//     subscribeToPlan,
//     upgradePlan,
//     getMyInvoices,
//     cancelSubscription,
//     clearMyHistory,
//     getOwnerActivePlan,
//     getAllSubscriptions // Export this
// };




const AppDataSource = require("../config/data-source");
const Plan = require("../entities/Plan");
const Subscription = require("../entities/Subscription");
const Invoice = require("../entities/Invoice");
const User = require("../entities/User");

// 1. SUBSCRIBE TO PLAN
const subscribeToPlan = async (req, res) => {
    try {
        const { planId, paymentMethod } = req.body;
        const userId = req.user.id;
        const subRepo = AppDataSource.getRepository(Subscription);
        const planRepo = AppDataSource.getRepository(Plan);
        const invRepo = AppDataSource.getRepository(Invoice);

        // Check if user already has an active plan
        const existingSub = await subRepo.findOne({ where: { user: { id: userId }, status: 'active' } });
        if (existingSub) return res.status(400).json({ message: "Plan already active. Use Upgrade." });

        const plan = await planRepo.findOneBy({ id: parseInt(planId) });
        if (!plan) return res.status(404).json({ message: "Plan not found" });

        const startDate = new Date();
        let endDate = new Date();
        plan.duration === 'monthly' 
            ? endDate.setMonth(startDate.getMonth() + 1) 
            : endDate.setFullYear(startDate.getFullYear() + 1);

        const newSub = subRepo.create({ 
            user: { id: userId }, 
            plan: { id: planId }, 
            status: 'active', 
            startDate, 
            endDate 
        });
        const savedSub = await subRepo.save(newSub);

        // Generate Invoice with Payment Method
        await invRepo.save({ 
            user: { id: userId }, 
            subscription: savedSub, 
            amount: plan.price, 
            invoiceNumber: "INV-" + Date.now(), 
            status: 'Paid',
            paymentMethod: paymentMethod || 'Credit Card'
        });

        res.json({ message: "Subscribed successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Subscription failed: " + err.message });
    }
};

// 2. UPGRADE/DOWNGRADE
const upgradePlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const subRepo = AppDataSource.getRepository(Subscription);

        const currentSub = await subRepo.findOne({ where: { user: { id: userId }, status: 'active' } });
        
        if (currentSub) {
            currentSub.status = 'cancelled';
            await subRepo.save(currentSub);
        }
        
        return subscribeToPlan(req, res);
    } catch (err) {
        res.status(500).json({ message: "Upgrade/Downgrade process failed" });
    }
};

// 3. GET MY INVOICES
const getMyInvoices = async (req, res) => {
    try {
        const userId = req.user.id;
        const invRepo = AppDataSource.getRepository(Invoice);

        const history = await invRepo.createQueryBuilder("invoice")
            .leftJoinAndSelect("invoice.subscription", "subscription")
            .leftJoinAndSelect("subscription.plan", "plan")
            .where("invoice.user = :userId", { userId })
            .orderBy("invoice.createdAt", "DESC")
            .getMany();

        const formattedHistory = history.map(inv => ({
            id: inv.id,
            invoiceNumber: inv.invoiceNumber,
            amount: inv.amount,
            status: inv.status,
            paymentMethod: inv.paymentMethod,
            subStatus: inv.subscription?.status,
            planName: inv.subscription?.plan?.name || 'Standard Plan',
            startDate: inv.subscription?.startDate,
            endDate: inv.subscription?.endDate
        }));

        res.json(formattedHistory);
    } catch (err) {
        res.status(500).json({ message: "Error fetching history" });
    }
};

// 4. CANCEL SUBSCRIPTION
const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        const subRepo = AppDataSource.getRepository(Subscription);
        const sub = await subRepo.findOne({ where: { user: { id: userId }, status: 'active' } });

        if (!sub) return res.status(404).json({ message: "No active plan found." });

        sub.status = 'cancelled';
        await subRepo.save(sub);
        res.json({ message: "Subscription cancelled successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. CLEAR HISTORY
const clearMyHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const invRepo = AppDataSource.getRepository(Invoice);
        const subRepo = AppDataSource.getRepository(Subscription);

        await invRepo.delete({ user: { id: userId } });
        await subRepo.delete({ user: { id: userId }, status: 'cancelled' });

        res.json({ message: "Billing history cleared successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Failed to clear history" });
    }
};

// 6. GET OWNER ACTIVE PLAN
const getOwnerActivePlan = async (req, res) => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        const subRepo = AppDataSource.getRepository(Subscription);

        const member = await userRepo.findOne({
            where: { id: req.user.id },
            relations: ["owner"]
        });

        if (!member || !member.owner) return res.status(404).json({ message: "Owner not found" });

        const activeSub = await subRepo.findOne({
            where: { user: { id: member.owner.id }, status: "active" },
            relations: ["plan"]
        });

        res.json({ activePlanName: activeSub ? activeSub.plan.name : null });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch workspace plan" });
    }
};

// 7. GET ALL SUBSCRIPTIONS (Admin Only)
const getAllSubscriptions = async (req, res) => {
    try {
        const subRepo = AppDataSource.getRepository(Subscription);
        const allSubs = await subRepo.find({
            relations: ["user", "plan"],
            order: { startDate: "DESC" }
        });
        res.json(allSubs);
    } catch (err) {
        res.status(500).json({ message: "Admin access failed: " + err.message });
    }
};

// Exports
module.exports = {
    subscribeToPlan,
    upgradePlan,
    getMyInvoices,
    cancelSubscription,
    clearMyHistory,
    getOwnerActivePlan,
    getAllSubscriptions
};