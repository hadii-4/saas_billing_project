const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Subscription",
    tableName: "subscriptions",
    columns: {
        id: { primary: true, type: "int", generated: true },
        startDate: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
        endDate: { type: "timestamp" },
        status: { type: "varchar", default: "active" }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: true,
            onDelete: "CASCADE"
        },
        plan: {
            target: "Plan",
            type: "many-to-one", // Fixed from many-to-many to many-to-one
            joinColumn: true,
            onDelete: "SET NULL"
        }
    }
});