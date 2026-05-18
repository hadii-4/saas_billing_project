


// const express = require("express");
// const router = express.Router();
// const { 
//     subscribeToPlan, 
//     upgradePlan,       // <--- Ye line lazmi check karo, yahan missing hoga
//     getMyInvoices, 
//     cancelSubscription, 
//     clearMyHistory,
//     getOwnerActivePlan 
// } = require("../controllers/subscriptionController");
// const { authenticate } = require("../middleware/auth");

// // Routes definition
// router.post("/buy", authenticate, subscribeToPlan);
// router.put("/upgrade", authenticate, upgradePlan); // Ab ye error nahi dega
// router.get("/my-invoices", authenticate, getMyInvoices);
// router.put("/cancel", authenticate, cancelSubscription);
// router.delete("/clear-history", authenticate, clearMyHistory);
// router.get("/owner-plan", authenticate, getOwnerActivePlan);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { 
    subscribeToPlan, 
    upgradePlan, 
    getMyInvoices, 
    cancelSubscription, 
    clearMyHistory,
    getOwnerActivePlan 
} = require("../controllers/subscriptionController");
const { authenticate } = require("../middleware/auth");

router.post("/buy", authenticate, subscribeToPlan);
router.put("/upgrade", authenticate, upgradePlan);
router.get("/my-invoices", authenticate, getMyInvoices);
router.put("/cancel", authenticate, cancelSubscription);
router.delete("/clear-history", authenticate, clearMyHistory);
router.get("/owner-plan", authenticate, getOwnerActivePlan);

module.exports = router;