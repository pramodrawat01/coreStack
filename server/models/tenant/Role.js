import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    permissions : [{
        type : String
    }],
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