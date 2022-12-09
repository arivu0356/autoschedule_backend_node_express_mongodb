import mongoose, { Document, Schema } from 'mongoose';

export interface Position {}

export interface PositionModel extends Position, Document {}

const PositionSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: mongoose.Schema.Types.ObjectId},
        modifiedBy: { type: mongoose.Schema.Types.ObjectId }
    },
    { timestamps: true }
);

export default mongoose.model<PositionModel>('Position', PositionSchema);
