const jwt = require( "jsonwebtoken" );

const SECRET = "superSuperSecret";

/* eslint consistent-return: "off" */
/* eslint complexity: off */
module.exports = ( req, res, next ) => {
    const token = req.body.token || req.query.token || req.headers[ "x-access-token" ];
    const person = req.user || req.admin;

    if ( !token || !person ) {
        return res.unauthorized( );
    }

    jwt.verify( token, SECRET, ( err, decoded ) => {
        if ( err ) {
            return res.json( {
                success: false,
                message: "Failed to authenticate token.",
            } );
        }
        req.decoded = decoded;
        if ( person.id !== decoded.id ) {
            return res.unauthorized( );
        }
        return next( );
    } );
};
