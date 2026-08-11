import WishList from "../models/wishlist.model.js";

// Add to wishlist
export const addWishList = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;

        const existing = await WishList.findOne({ user: req.user._id, property: propertyId });
        if (existing) {
            return res.status(200).json({ success: true, message: "Property already in wishlist" });
        }
        await WishList.create({ user: req.user._id, property: propertyId });
        res.status(201).json({ success: true, message: "Property added to wishlist" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get user's wishlist
export const getWishList = async (req, res) => {
    try {
        const data = await WishList.find({ user: req.user._id }).populate("property");
        res.status(200).json({ wishlist: data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Remove from wishlist
export const removeWishList = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const result = await WishList.findOneAndDelete({ user: req.user._id, property: propertyId });

        if (!result) {
            return res.status(404).json({ success: false, message: "Property not found in wishlist" });
        }

        res.status(200).json({ success: true, message: "Property removed from wishlist" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};