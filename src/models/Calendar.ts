import mongoose, { Document, Schema } from 'mongoose';

export interface Calendar {}

export interface CalendarModel extends Calendar, Document {}

const CalendarSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId },
        Date: { type: Date },
        StartTime: { type: Date },
        EndTime: { type: Date },
        position: [{ type: mongoose.Schema.Types.ObjectId, Ref: 'Position' }],
        employee: [{ type: mongoose.Schema.Types.ObjectId, Ref: 'User' }],
        shift: { type: String },
        isActive: { type: Boolean, default: true },
        isPublished: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: mongoose.Schema.Types.ObjectId },
        modifiedBy: { type: mongoose.Schema.Types.ObjectId }
    },
    { timestamps: true }
);

export default mongoose.model<CalendarModel>('Calendar', CalendarSchema);
