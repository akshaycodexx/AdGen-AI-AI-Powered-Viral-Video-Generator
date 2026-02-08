import mongoose from 'mongoose';

const scriptSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productName: { type: String, required: true },
    description: { type: String },
    targetAudience: { type: String },
    tone: { type: String },
    generatedScript: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Script', scriptSchema);
