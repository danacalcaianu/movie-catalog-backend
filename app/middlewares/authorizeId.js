const mongoose = require( "mongoose" );

const User = mongoose.model( "User" );

module.exports = function( req, res, next ) {
    const id = req.params.userId;
    if ( !id ) {
        return res.preconditionFailed( "missing_id" );
    }
    return User.findOne(
// <<<<<<< create-movie-model
//         { id },
//         function( err, user ) {
//             if ( err ) {
// =======
        { id },
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
