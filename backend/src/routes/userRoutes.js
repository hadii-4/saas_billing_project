const express = require("express");
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    addTeamMember, 
    getMyTeam,
    updateTeamMember,
    deleteTeamMember,
    inviteTeamMember
} = require("../controllers/userController");

const { getAllSubscriptions } = require("../controllers/subscriptionController"); 
const { getAllInvoices, clearAllInvoices } = require("../controllers/invoiceController");

const { authenticate, authorize } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

// --- Admin Specific Routes (Requirement: Admin panel to manage subscriptions) ---
router.get(
    "/admin/all-subscriptions",
    authenticate,
    authorize(["Admin"]),
    getAllSubscriptions
);

router.get(
    "/admin/all-invoices",
    authenticate,
    authorize(["Admin"]),
    getAllInvoices
);

router.delete(
    "/admin/clear-invoices",
    authenticate,
    authorize(["Admin"]),
    clearAllInvoices
);

// --- Account Owner / Team Management Routes (Pehlay wala flow) ---
router.post(
    "/add-member",
    authenticate,
    authorize(["Account Owner"]),
    addTeamMember
);

router.post(
    "/invite-member",
    authenticate,
    authorize(["Account Owner"]),
    inviteTeamMember
);

router.get(
    "/my-team",
    authenticate,
    authorize(["Account Owner"]),
    getMyTeam
);

router.put(
    "/member/:id",
    authenticate,
    authorize(["Account Owner"]),
    updateTeamMember
);

router.delete(
    "/member/:id",
    authenticate,
    authorize(["Account Owner"]),
    deleteTeamMember
);

module.exports = router;