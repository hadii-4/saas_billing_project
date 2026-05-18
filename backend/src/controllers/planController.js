const AppDataSource = require("../config/data-source");
const Plan = require("../entities/Plan");

// ... (purany functions createPlan aur getAllPlans yahan rehny dain)

const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, duration, features } = req.body;
        const planRepository = AppDataSource.getRepository(Plan);

        let plan = await planRepository.findOneBy({ id: parseInt(id) });

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        // Updating fields
        plan.name = name;
        plan.price = price;
        plan.duration = duration;
        plan.features = features; // Ye line features ko update kray gi

        await planRepository.save(plan);
        
        res.json({ message: "Plan updated successfully!", plan });
    } catch (error) {
        res.status(500).json({ message: "Error updating plan", error: error.message });
    }
};

const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const planRepository = AppDataSource.getRepository(Plan);
        const result = await planRepository.delete(id);

        if (result.affected === 0) {
            return res.status(404).json({ message: "Plan not found" });
        }

        res.json({ message: "Plan deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting plan", error: error.message });
    }
};

// Exports mein lazmi add karein
module.exports = { createPlan, getAllPlans, updatePlan, deletePlan };