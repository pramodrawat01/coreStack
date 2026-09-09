import mongoose from 'mongoose'

const inviteSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    dbName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, required: true }, // resolved against the tenant DB on accept
    token: { type: String, required: true, unique: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Invite', inviteSchema)