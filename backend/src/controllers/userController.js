
const AppDataSource = require("../config/data-source");
const User = require("../entities/User");
const Invitation = require("../entities/Invitation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOneBy({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = userRepository.create({
            fullName,
            email,
            password: hashedPassword,
            role: "Account Owner"
        });

        await userRepository.save(newUser);

        res.status(201).json({
            message: "Account Owner registered successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Database Error",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { email },
            relations: ["owner"]
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "secret_key",
            { expiresIn: "1d" }
        );

        const ownerName =
            user.role === "Team Member" && user.owner
                ? user.owner.fullName
                : user.fullName;

        res.json({
            message: "Login successful",
            token,
            role: user.role,
            userName: user.fullName,
            ownerName: ownerName
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};

// ADD TEAM MEMBER

const addTeamMember = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const ownerId = req.user.id;

        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOneBy({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            fullName,
            email,
            password: hashedPassword,
            role: "Team Member",
            owner: { id: ownerId }
        });

        await userRepository.save(newUser);

        res.status(201).json({
            message: "Team Member added successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add member",
            error: error.message
        });
    }
};

// GET TEAM
const getMyTeam = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const userRepository = AppDataSource.getRepository(User);

        const team = await userRepository.find({
            where: { owner: { id: ownerId } },
            select: ["id", "fullName", "email", "role"]
        });

        res.json(team);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching team",
            error: error.message
        });
    }
};

// UPDATE TEAM MEMBER
const updateTeamMember = async (req, res) => {
    try {
        const memberId = req.params.id;

        const { fullName, email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);

        const member = await userRepository.findOne({
            where: { id: memberId }
        });

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        member.fullName = fullName;
        member.email = email;

        // Password optional
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            member.password = hashedPassword;
        }

        await userRepository.save(member);

        res.json({
            message: "Member updated successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update member",
            error: error.message
        });
    }
};

// INVITE TEAM MEMBER
const inviteTeamMember = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const ownerId = req.user.id;

        const userRepository = AppDataSource.getRepository(User);
        const invitationRepository = AppDataSource.getRepository(Invitation);

        // Check if user already exists
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if invitation already sent
        let existingInvitation = await invitationRepository.findOneBy({ email });
        if (existingInvitation) {
            if (existingInvitation.status === 'pending') {
                const now = new Date();
                if (existingInvitation.expiresAt > now) {
                    return res.status(400).json({ message: "Invitation already sent" });
                }
                existingInvitation.status = 'expired';
                await invitationRepository.save(existingInvitation);
            }
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');

        // Expires in 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation = invitationRepository.create({
            email,
            token,
            invitedBy: ownerId,
            expiresAt
        });

        await invitationRepository.save(invitation);

        let transporter;
        let mailOptions = {
            from: process.env.EMAIL_USER || 'no-reply@example.com',
            to: email,
            subject: 'Team Invitation',
            text: `You have been invited to join the team. Click here to accept: http://localhost:3000/accept-invite?token=${token}`
        };
        let responseMessage = "Invitation sent successfully";

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        } else {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            responseMessage = "Invitation created successfully. Email sent via Ethereal test account. Check backend logs for preview URL.";
        }

        const info = await transporter.sendMail(mailOptions);
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log('Ethereal test email preview URL:', previewUrl);
        }

        res.status(200).json({ message: responseMessage });

    } catch (error) {
        console.error("Invite error:", error);
        res.status(500).json({
            message: "Failed to send invitation",
            error: error.message
        });
    }
};

// DELETE TEAM MEMBER
const deleteTeamMember = async (req, res) => {
    try {
        const memberId = req.params.id;

        const userRepository = AppDataSource.getRepository(User);

        // invoices table direct query se clear karo
        await AppDataSource.query(
            `DELETE FROM invoices WHERE "userId" = $1`,
            [memberId]
        );

        const member = await userRepository.findOne({
            where: { id: memberId }
        });

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        await userRepository.remove(member);

        res.json({
            message: "Member deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to delete member",
            error: error.message
        });
    }
};



module.exports = {
    registerUser,
    loginUser,
    addTeamMember,
    getMyTeam,
    updateTeamMember,
    deleteTeamMember,
    inviteTeamMember
};

