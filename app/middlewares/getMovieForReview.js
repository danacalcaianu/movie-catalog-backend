const mongoose = require( "mongoose" );

const Movie = mongoose.model( "Movie" );

module.exports = ( req, res, next ) => {
    const reviewId = req.params.reviewId;

    Movie
        .find( { "reviews.id": reviewId } ) // { reviews: 1, _id: 0 } )
        .exec( ( err, result ) => {
            if ( err ) {
                return res.notFound();
            }
            // const [ { reviews } ] = result;
            // const [ filteredReview ] = reviews.filter( ( review ) => review.id === reviewId );
            // req.review = filteredReview;
            [ req.movie ] = result;
            return next();
        } );
};
