const mongoose = require( "mongoose" );
const isValidEmail = require( "../utilities" ).isValidEmail;

const User = mongoose.model( "User" );

module.exports = function( req, res, next ) {
    const username = req.body.username;
    const email = req.body.email;
    if ( !username ) {
        return res.preconditionFailed( "missing_username" );
    }
    if ( !email ) {
        return res.preconditionFailed( "missing_email" );
    }
    if ( !isValidEmail( email ) ) {
        return res.preconditionFailed( "invalid_email" );
    }
    return User.findOne(
        { username },
        function( err, userFound ) {
            if( err ) {
              // if( err ) {
                return res.serverError( );
              // }
              // return res.unauthorized( );
            }
            req.user = userFound;
            return next( );
        } );
};
