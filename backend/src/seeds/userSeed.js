const User = require("../entities/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async (dataSource) => {
    const userRepository = dataSource.getRepository(User);
    
    // Check karna ke kya koi admin pehle se hai
    const adminExists = await userRepository.findOneBy({ role: "Admin" });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const defaultAdmin = userRepository.create({
            fullName: "Default Admin",
            email: "admin@project.com",
            password: hashedPassword,
            role: "Admin"
        });

        await userRepository.save(defaultAdmin);
        console.log("✅ Default Admin created: admin@project.com / admin123");
    } else {
        console.log("ℹ️ Admin already exists, skipping seed.");
    }
};

module.exports = seedAdmin;