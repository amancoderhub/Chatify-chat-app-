import dotenv from "dotenv"
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"

import {Server} from "socket.io"

import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";

import conversationRoutes from "./routes/conversationRoutes.js";
import { initializeSocket } from "./socket.js";
import { socketAuthMiddleware } from "./socket/socketAuthMiddleware.js";
import redisService from "./services/RedisService.js";

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
    origin : process.env.CLIENT_ORIGIN,
    credentials: true,
}))   
app.use(express.json())
app.use(cookieParser())

//Routes
app.use("/api/auth", authRoutes);
app.use('/api/conversations', conversationRoutes);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
        methods: ["GET", "POST"]
    },
    pingInterval: 25000,
    pingTimeout: 60000,
})
io.use(socketAuthMiddleware);

await initializeSocket(io);

const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);

    try {
        await redisService.disconnect();

        httpServer.close(() => {
            console.log("HTTP server closed");
            process.exit(0);
        });
    } catch (error) {
        console.error("Error during shutdown", error);
        process.exit(1);
    }
};

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

try{
    await connectDB();
    await redisService.initialize();

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () =>{
        console.log(`Server running on port: ${PORT}`);
    })   
}
catch(error){ 
    console.error("The Server failed on start", error);
    process.exit(1);
}
