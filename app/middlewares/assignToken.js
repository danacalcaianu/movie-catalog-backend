const jwt = require( "jsonwebtoken" );

const SECRET = "superSuperSecret";

module.exports = ( req, res, next ) => {
    const person = req.user || req.admin;

    if ( !person ) {
        return res.unauthorized();
    }
    req.token = jwt.sign( person.toObject(), SECRET, { expiresIn: 1440 } );
    return next();
};
