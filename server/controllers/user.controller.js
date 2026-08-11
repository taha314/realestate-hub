import User from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';


// get Profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// to get public profile
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name profilePic role createdAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// to update profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, removeProfilePic } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Handle profile picture update
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'profiles');
            user.profilePic = result.secure_url;
        } else if (removeProfilePic) {
            user.profilePic = null;
        }
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        const updatedUser = await user.save();
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};