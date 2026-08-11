import mongoose from 'mongoose';

const wishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
    }
});

const WishList = mongoose.model("WishList", wishListSchema);
export default WishList;