import mongoose, { Schema } from 'mongoose';
const dataSchema = new mongoose.Schema({
    code: {
        required: true,
        type: String
    },
    expiresAt: {
        required: true,
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
export const UserOtp = mongoose.model('UserOtp', dataSchema);
