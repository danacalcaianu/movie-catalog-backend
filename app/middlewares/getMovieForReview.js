const mongoose = require( "mongoose" );

const Movie = mongoose.model( "Movie" );

module.exports = ( req, res, next ) => {
    const reviewId = req.params.reviewId;
    Movie
        .find( { "reviews.id": reviewId } )
        .exec( ( err, result ) => {
            if ( err || result.length === 0 ) {
                return res.notFound();
            }
            [ req.movie ] = result;
            return next();
        } );
};
