const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Plan",
    tableName: "plans",
    columns: {
        id: { primary: true, type: "int", generated: true },
        name: { type: "varchar" }, // e.g., 'Pro Plan'
        price: { type: "decimal" },
        duration: { type: "varchar" }, // 'monthly' or 'yearly'
        features: { type: "simple-array", nullable: true } // List of features
    }
});