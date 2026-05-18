const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: { primary: true, type: "int", generated: true },
        fullName: { type: "varchar" },
        email: { type: "varchar", unique: true },
        password: { type: "varchar" },
        role: { 
            type: "enum", 
            enum: ["Admin", "Account Owner", "Team Member"], 
            default: "Team Member" 
        }
    },
    // Purane code mein ye relations add kar diye hain
    relations: {
        owner: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "ownerId" },
            nullable: true,
            onDelete: "CASCADE"
        }
    }
});