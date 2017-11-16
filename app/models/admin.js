const mongoose = require( "mongoose" );
const bcrypt = require( "bcrypt-nodejs" );

const Schema = mongoose.Schema;
const uid = require( "uid" );

const adminSchema = new Schema( {
    id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
}, {
    timestamps: true,
} );

/* eslint func-names : off */
adminSchema.methods.setId = function() {
    this.id = uid( 10 );
};

adminSchema.methods.setPass = function( password ) {
    this.password = bcrypt.hashSync( password );
};

module.exports = mongoose.model( "Admin", adminSchema );
