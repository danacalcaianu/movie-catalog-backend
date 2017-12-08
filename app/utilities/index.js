const co = require( "co" );

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

// exports.queryModel = ( res, model, query ) => model.find(
//     query,
//     ( err, results ) => {
//         if ( err ) {
//             return res.serverError();
//         }
//         return res.success( results );
//     },
// );

// exports.queryModel = ( res, model, query ) => model.find(
//     query ).then( ( results ) => {
//     return res.success( results );
// } );

exports.queryBatch = async ( model, number, limitSize ) => {
    try {
        const movies = await model
            .find()
            .skip( limitSize * number )
            .limit( limitSize );
        return movies;
    } catch ( err ) {
        return err;
    }
};

exports.queryModel = co.wrap( function* ( model, query ) {
    const movies = yield model.find( query );
    return movies;
} );
