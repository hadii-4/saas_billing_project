// const EntitySchema = require("typeorm").EntitySchema;

// module.exports = new EntitySchema({
//     name: "Invoice",
//     tableName: "invoices",
//     columns: {
//         id: { primary: true, type: "int", generated: true },
//         invoiceNumber: { type: "varchar" },
//         amount: { type: "decimal" },
//         status: { type: "varchar", default: "paid" },
//         createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" }
//     },
//     relations: {
//         user: {
//             target: "User",
//             type: "many-to-one",
//             joinColumn: true
//         },
//         subscription: {
//             target: "Subscription",
//             type: "many-to-one", // Fixed from "m" to "many-to-one"
//             joinColumn: true
//         }
//     },

//     // ... existing columns
//         invoiceNumber: { type: "varchar" },
//         amount: { type: "decimal" },
//         paymentMethod: { type: "varchar", nullable: true }, // Naya field
//         transactionId: { type: "varchar", nullable: true }, // Naya field
//         status: { type: "varchar", default: "paid" },
// // ... rest of the file
// });

const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Invoice",
    tableName: "invoices",
    columns: {
        id: { primary: true, type: "int", generated: true },
        invoiceNumber: { type: "varchar" },
        amount: { type: "decimal" },
        paymentMethod: { type: "varchar", nullable: true, default: "Credit Card" },
        transactionId: { type: "varchar", nullable: true }, 
        status: { type: "varchar", default: "paid" },
        createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: true,
            onDelete: "CASCADE"
        },
        subscription: {
            target: "Subscription",
            type: "many-to-one",
            joinColumn: true,
            onDelete: "SET NULL"
        }
    }
});
