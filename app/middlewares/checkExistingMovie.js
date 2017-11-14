const mongoose = require( "mongoose" );

const Movie = mongoose.model( "Movie" );

module.exports = function( req, res, next ) {
    const id = req.params.movieId;
    if ( !id ) {
        return res.preconditionFailed( "missing_id" );
    }

    return Movie.findOne(
        { id },
        function( err, foundMovie ) {
            if ( err ) {
              // if( err ) {
                return res.serverError( );
              // }
              // return res.unauthorized( );
            }
            req.movie = foundMovie;
            return next( );
        } );
};
