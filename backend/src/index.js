const express = require("express");
const AppDataSource = require("./config/data-source");
const cors = require("cors");
require('dotenv').config();

// Routes Imports
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes"); // Naya import
const seedAdmin = require("./seeds/userSeed"); 

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/users", userRoutes); 
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes); // Subscription endpoint set kar diya

const PORT = process.env.PORT || 3000;

// Database Initialization
AppDataSource.initialize()
    .then(async () => {
        console.log("Database connected successfully!");
        
        // Seed default admin
        await seedAdmin(AppDataSource);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => console.log("Database connection error: ", error));