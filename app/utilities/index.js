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

// exports.queryModel = async ( res, model, query ) => {
//     try {
//         const movies = await model.find( query );
//         return res.success( movies );
//     } catch ( err ) {
//         res.notFound( );
//     }
// };

exports.queryModel = co.wrap( function* ( model, query ) {
    let movies = yield model.find( query );
    return movies;
} );
