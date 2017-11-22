const mongoose = require( "mongoose" );

module.exports = ( collection ) => ( req, res, next ) => {
    const { email } = req.body;
    const Collection = mongoose.model( collection );
    return Collection.findOne(
        { email },
        ( err, found ) => {
            if ( err ) {
                return res.serverError( );
            }
            if ( found ) {
                return res.conflict( "Email already exists!" );
            }
            return next();
        },
    );
};
