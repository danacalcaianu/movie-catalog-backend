const mongoose = require( "mongoose" );

module.exports = ( req, res, next ) => {
    const { movieId } = req.params;
    const { userId } = req.params;
    const Collection = mongoose.model( "Movie" );
    return Collection.findOne(
        { id: movieId },
        ( err, found ) => {
            if ( err ) {
                return res.serverError( );
            }
            if ( !( found.addedBy === userId ) ) {
                return res.unauthorized();
            }
            return next();
        },
    );
};
