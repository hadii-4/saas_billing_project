const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Invitation",
    tableName: "invitations",
    columns: {
        id: { primary: true, type: "int", generated: true },
        email: { type: "varchar" },
        token: { type: "varchar", unique: true },
        invitedBy: { type: "int" }, // owner id
        status: { type: "enum", enum: ["pending", "accepted", "expired"], default: "pending" },
        createdAt: { type: "timestamp", createDate: true },
        expiresAt: { type: "timestamp" }
    },
    relations: {
        owner: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "invitedBy" },
            onDelete: "CASCADE"
        }
    }
});