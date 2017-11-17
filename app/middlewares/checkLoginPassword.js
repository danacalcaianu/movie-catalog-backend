const bcrypt = require( "bcrypt" );

module.exports = ( req, res, next ) => {
    const person = req.user || req.admin;
    if ( !person ) {
        return res.unauthorized();
    }
    if ( !req.body.password ) {
        return res.status( 400 ).send( "password required" );
    }

    const password = bcrypt.compareSync( req.body.password, person.password );
    if ( !password ) {
        return res.unauthorized();
    }
    return next();
};
