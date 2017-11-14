const mongoose = require( "mongoose" );

const User = mongoose.model( "User" );

module.exports = function( req, res, next ) {
    console.log("here");
    const username = req.body.username;
    if ( !username ) {
        return res.preconditionFailed( "missing_username" );
    }
    return User.findOne(
// <<<<<<< create-movie-model
//         { id },
//         function( err, user ) {
//             if ( err ) {
// =======
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
