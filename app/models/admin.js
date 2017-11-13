const mongoose = require( "mongoose" );

const schema = mongoose.Schema;

const adminSchema = new Schema( {
    id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
} ,{
    timestamps: true,
} );


adminSchema.methods.setPass = function( password ) {
    this.password = bcrypt.hashSync( password );
}

module.exports = mongoose.model( "Admin", adminSchema );