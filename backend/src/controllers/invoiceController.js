const AppDataSource = require("../config/data-source");
const Invoice = require("../entities/Invoice");

const getMyInvoices = async (req, res) => {
    try {
        const invoiceRepo = AppDataSource.getRepository(Invoice);
        
        const invoices = await invoiceRepo.find({
            where: { user: { id: req.user.id } },
            relations: ["subscription", "subscription.plan"],
            order: { createdAt: "DESC" } // Latest invoices pehle dikhane ke liye
        });

        // Frontend ki requirements ke mutabiq data ko flatten karna:
        const formattedInvoices = invoices.map(inv => ({
            id: inv.id,
            invoiceNumber: inv.invoiceNumber,
            userEmail: inv.user?.email || 'N/A',
            planName: inv.subscription?.plan?.name || "N/A",
            amount: inv.amount,
            status: inv.status || "paid",
            startDate: inv.subscription?.startDate || inv.createdAt,
            endDate: inv.subscription?.endDate || "N/A",
            createdAt: inv.createdAt
        }));

        res.json(formattedInvoices);
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllInvoices = async (req, res) => {
    try {
        const invoiceRepo = AppDataSource.getRepository(Invoice);

        const invoices = await invoiceRepo.createQueryBuilder("invoice")
            .leftJoinAndSelect("invoice.user", "user")
            .leftJoinAndSelect("invoice.subscription", "subscription")
            .leftJoinAndSelect("subscription.plan", "plan")
            .orderBy("invoice.createdAt", "DESC")
            .getMany();

        const formattedInvoices = invoices.map(inv => ({
            id: inv.id,
            invoiceNumber: inv.invoiceNumber,
            userEmail: inv.user?.email || 'N/A',
            planName: inv.subscription?.plan?.name || 'N/A',
            amount: inv.amount,
            status: inv.subscription?.status || inv.status || 'paid',
            subStatus: inv.subscription?.status || null,
            startDate: inv.subscription?.startDate || inv.createdAt,
            endDate: inv.subscription?.endDate || 'N/A',
            createdAt: inv.createdAt
        }));

        res.json(formattedInvoices);
    } catch (error) {
        console.error("Error fetching all invoices:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const clearAllInvoices = async (req, res) => {
    try {
        const invoiceRepo = AppDataSource.getRepository(Invoice);
        await invoiceRepo.clear();
        res.json({ message: "All invoice history cleared successfully." });
    } catch (error) {
        console.error("Error clearing invoices:", error);
        res.status(500).json({ message: "Unable to clear invoice history." });
    }
};

module.exports = { getMyInvoices, getAllInvoices, clearAllInvoices };