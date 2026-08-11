import User from "../models/user.model.js";
import Property from "../models/propert.model.js";
import Inquiry from "../models/inquiry.model.js";

// View all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, count: users.length, users });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Block a particular user
export const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ success: true, message: user.isBlocked ? "blocked" : "unblocked",
            isBlocked: user.isBlocked
         });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// to delete a perticular user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// View All Properties
export const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate("seller", "name email");
        res.json({ success: true, count: properties.length, properties });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// to delete a perticular property
export const deleteProperty = async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ success: true, message: "Property deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// to view all inquiries
export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .populate("buyer", "name email")
            .populate("seller", "name email")
            .populate("property", "title price")
            .sort({ createdAt: -1 });
        res.json({ success: true, count: inquiries.length, inquiries });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// dashborad stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const activeListings = await Property.countDocuments({ status: "sale" });
        const soldProperties = await Property.countDocuments({ status: "sold" });
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProperties,
                activeListings,
                soldProperties,
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// To get pending seller account
export const getPendingSellers = async (req, res) => {
    try {
        const pendingSellers = await User.find({ role: "seller", isApproved: false }).select("-password");
        res.json({ success: true, count: pendingSellers.length, pendingSellers });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// To approve or reject seller account
export const approveSeller = async (req, res) => {
    try {
        const seller = await User.findById(req.params.id);
        if (!seller || seller.role !== "seller") {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }
        seller.isApproved = true;
        await seller.save();
        res.json({ success: true, message: "Seller approved successfully", seller });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
