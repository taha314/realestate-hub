import express from "express";

import Chat from "../models/chat.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const chatRouter = express.Router();
chatRouter.use(protect);

// Create a new chat
chatRouter.post("/start", async (req, res) => {
    try {
        const { propertyId, sellerId, buyerId: providedBuyerId } = req.body;
        let buyerId, finalSellerId;

        if (req.user.role === "seller") {
            buyerId = providedBuyerId;
            finalSellerId = req.user._id;
        }
        else {
            buyerId = req.user._id;
            finalSellerId = sellerId;
        }
        if (!buyerId || !finalSellerId) {
            return res.status(400).json({ message: "Missing buyerId or sellerId" });
        }
        let chat = await Chat.findOne({ buyer: buyerId, seller: finalSellerId });
        if (!chat) {
            chat = await Chat.create({ buyer: buyerId, seller: finalSellerId, property: propertyId, messages: [] });
        }
        chat = await Chat.findById(chat._id).populate("buyer", "name email profilePic").populate("seller", "name email profilePic").populate("property", "title, price, images");
        res.json(chat);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// to send a message in a chat
chatRouter.post("/send", async (req, res) => {
    try {
        const { chatId, text, image } = req.body;
        const userId = req.user.id;
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({
            message: "Chat not found"
        })
        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({
                message: "You are not a participant of this chat"
            });
        }
        const newMessage = {
            sender: userId,
            text,
            image,
            createdAt: new Date()
        };
        chat.messages.push(newMessage);
        await chat.save();
        const savedMessage = chat.messages[chat.messages.length - 1];
        res.json({ chat, newMessage: savedMessage });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Get all chats for a user
chatRouter.get("/user", async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({ $or: [{ buyer: userId }, { seller: userId }] })
            .populate("buyer", "name email profilePic").populate("seller", "name email profilePic").populate("property", "title, price, images").sort({ updatedAt: -1 });
        res.json(chats);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// to get messages of a chat
chatRouter.get("/:chatId", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate(
            "messages.sender", "name profilePic");
        if (!chat) return res.status(404).json({ message: "Chat not found" });
        const userId = req.user._id.toString();

        if (
            chat.buyer.toString() !== userId &&
            chat.seller.toString() !== userId
        ) {
            return res.status(403).json({
                message: "You are not a participant of this chat"
            });
        }
        res.json(chat);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// to delete an entire chat
chatRouter.delete("/:chatId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });
        if (chat.buyer.toString() !== userId.toString() && chat.seller.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not a participant of this chat" });
        }
        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({ message: "Chat deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// to delete a message from a chat
chatRouter.delete("/:chatId/message/:messageId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });
        const message = chat.messages.id(req.params.messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });
        if (message.sender.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }
        chat.messages.pull(message._id);
        await chat.save();
        res.json({ message: "Message deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

export default chatRouter;