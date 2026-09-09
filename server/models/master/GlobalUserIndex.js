import mongoose from 'mongoose'

const globalUserIndexSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    dbName: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('GlobalUserIndex', globalUserIndexSchema)