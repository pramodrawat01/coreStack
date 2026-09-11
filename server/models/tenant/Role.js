import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    description: { type: String, trim: true, default: '' },
    permissions : {
        type : mongoose.Schema.Types.Mixed, 
        default : {},
    },
    isDefaultOwnerRole : {
        type : Boolean,
        default : false
    }
}, {
    timestamps: true
})

export function getRoleModel(connection){
    return connection.models.Role || connection.model('Role', roleSchema)
}