import mongoose, { Document, Schema } from 'mongoose';

export interface User {}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, trim: true },
        firstName: { type: String },
        lastName: { type: String },
        password: { type: String, trim: true },
        role: { type: String },
        position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
        constraints: [String],
        unAvailability: [Date],
        businessName: { type: String },
        industry: { type: String },
        noOfEmp: { type: Number },
        location: { type: String },
        otp: { type: String },
        otpValidUpto: { type: Date, default: null },
        isVerified: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: String },
        modifiedBy: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model<UserModel>('User', UserSchema);
