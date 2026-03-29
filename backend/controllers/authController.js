import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import generateUniqueConnectCode from "../utils/generateUniqueConnectCode.js"
import redisService from "../services/RedisService.js"

const generateToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const isProduction = process.env.NODE_ENV === "production";

const authCookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
};

class AuthController {
    static async register(req, res){
        try{
                const {fullName, username, email, password} = req.body;
                const normalizedFullName = fullName?.trim();
                const normalizedUsername = username?.trim().toLowerCase();
                const normalizedEmail = email?.trim().toLowerCase();

                if(!normalizedFullName || !normalizedUsername || !normalizedEmail || !password){
                    return res.status(400).json({message : "All fields are required"});
                }
                if(password.length<6){
                    return res.status(400).json({message : "Password length must be atleast 6 character long"});
                }

                const existingUser = await User.findOne({
                    $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
                });

                if(existingUser){
                    return res.status(400).json({message: "User already exists with username or emial"});
                }

                //hash password 
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const user = new User({
                    username: normalizedUsername,
                    fullName: normalizedFullName,
                    email: normalizedEmail,
                    password: hashedPassword,
                    connectCode:await generateUniqueConnectCode(),
                });

                await user.save();

                const token = generateToken(user.id);

                res.cookie("jwt", token, authCookieOptions);

                res.status(201).json({
                    user: {
                        id: user.id,
                        username: user.username,
                        fullName: user.fullName,
                        email: user.email,
                        connectCode: user.connectCode,
                        online: await redisService.isUserOnline(user._id.toString()),
                    },
                });
        }
        catch(error){
            console.log("Registration error", error);
            res.status(500).json({message: "Internal server error"});
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const normalizedEmail = email?.trim().toLowerCase();

            if (!normalizedEmail || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await User.findOne({ email: normalizedEmail });

            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });

            res.cookie("jwt", token, authCookieOptions);

            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    connectCode: user.connectCode,
                    online: await redisService.isUserOnline(user._id.toString()),
                },
            });
        } catch (error) {
            console.log("Login error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async me(req, res) {
        try {
            const user = await User.findById(req.user.id).select("-password");

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    connectCode: user.connectCode,
                    online: await redisService.isUserOnline(user._id.toString()),
                },
            });
        } catch (error) {
            console.log("Me error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: isProduction ? "none" : "lax",
                secure: isProduction,
            });

            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.log("Logout error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default AuthController
