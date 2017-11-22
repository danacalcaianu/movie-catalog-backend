module.exports = ( req, res, next ) => {
    let property = req.params.param;
    const field = {};

    if ( !property ) {
        req.body.field = {};
        return next();
    }
    if ( !Number.isInteger( parseInt( property, 10 ) ) ) {
        property = "categories";
        field[ property ] = req.params.param;
    } else {
        property = "averageRating";
        const lowerBound = Math.floor( Number( req.params.param, 10 ) );
        const upperBound = Math.round( Number( req.params.param, 10 ) );
        field[ property ] = { $gte: lowerBound, $lte: upperBound };
    }

    req.body.field = field;

    return next();
};
