const mongoose = require( "mongoose" );
const bcrypt = require( "bcrypt-nodejs" );

const Schema = mongoose.Schema;

const userSchema = new Schema( {
    id: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: [ "male", "female" ] },
    categories: [ { type: String, enum: [ "action", "comedy", "drama", "horror", "Sci-Fi", "romance" ] } ],
    avatar: { type: String },
    deleted: { type: Boolean, default: false },
    blockedBy: { type: String },
    blockedReason: { type: String },
} );

userSchema.methods.setPass = function( password ) {
    this.password = bcrypt.hashSync( password );
}

userSchema.virtual( "fullName" ).get( function () {
  return this.firstName + this.lastName;
} );

module.exports = mongoose.model( "User", userSchema );
