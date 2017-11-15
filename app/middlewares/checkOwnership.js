const mongoose = require( "mongoose" );

module.exports = ( ) => ( req, res, next ) => {
    const movieId = req.params.movieId;
    const userId = req.params.userId;
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
        } );
};
