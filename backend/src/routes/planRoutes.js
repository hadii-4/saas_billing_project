const express = require("express");
const router = express.Router();
const AppDataSource = require("../config/data-source");
const Plan = require("../entities/Plan");
const { authenticate } = require("../middleware/auth");

// 1. Saare plans dekhne ke liye
router.get("/", async (req, res) => {
    try {
        const planRepo = AppDataSource.getRepository(Plan);
        const plans = await planRepo.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: "Error fetching plans" });
    }
});

// 2. Naya Plan Add karne ke liye
router.post("/", authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // Added 'features' here
        const { name, price, duration, features } = req.body; 
        const planRepo = AppDataSource.getRepository(Plan);

        const newPlan = planRepo.create({ 
            name, 
            price, 
            duration, 
            features // Saving features array
        });
        
        await planRepo.save(newPlan);

        res.status(201).json({ message: "New Plan added successfully!", plan: newPlan });
    } catch (error) {
        res.status(500).json({ message: "Error creating plan", error: error.message });
    }
});

// 3. Plan Update karne ke liye (PUT)
router.put("/:id", authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        // Destructured 'features' for updating
        const { name, price, duration, features } = req.body; 
        const planRepo = AppDataSource.getRepository(Plan);

        let plan = await planRepo.findOneBy({ id: parseInt(id) });
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        // Updating fields with fallback to existing data
        plan.name = name || plan.name;
        plan.price = price !== undefined ? price : plan.price;
        plan.duration = duration || plan.duration;
        plan.features = features || plan.features; // Fixed: Now updates features

        await planRepo.save(plan);
        res.json({ message: "Plan updated successfully!", plan });
    } catch (error) {
        res.status(500).json({ message: "Error updating plan", error: error.message });
    }
});

// 4. Plan Delete karne ke liye (DELETE)
router.delete("/:id", authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        const planRepo = AppDataSource.getRepository(Plan);

        const plan = await planRepo.findOneBy({ id: parseInt(id) });
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        await planRepo.remove(plan);
        res.json({ message: "Plan deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting plan", error: error.message });
    }
});

module.exports = router;