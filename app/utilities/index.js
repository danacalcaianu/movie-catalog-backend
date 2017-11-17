exports.extractObject = ( obj, keys ) => {
    const returnObj = { };
    keys.forEach( key => { returnObj[ key ] = obj[ key ]; } );

    return returnObj;
};

exports.updateRating = ( movie, rating, username ) => {
    const ratingIndex = movie.getRatingIndex( username );
    if ( ratingIndex === -1 ) {
        movie.addRating( rating, username );
    } else {
        movie.updateRating( rating, ratingIndex );
    }
    movie.updateRatingAverage();
};

exports.saveChangesToModel = ( res, model ) => {
    model.save( ( err, updatedModel ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( updatedModel );
    } );
};

exports.queryModel = ( res, model, query ) => model.find(
    query,
    ( err, results ) => {
        if ( err ) {
            return res.serverError();
        }
        return res.success( results );
    },
);
