module.exports = ( req, res, next ) => {
    let property = req.params.param;
    const field = {};

    if ( !property ) {
        req.body.field = {};
        return next();
    }
    if ( isNaN( parseInt( property, 10 ) ) ) {
        property = "categories";
    } else {
        property = "rating";
    }

    field[ property ] = req.params.param;
    req.body.field = field;

    return next();
};
