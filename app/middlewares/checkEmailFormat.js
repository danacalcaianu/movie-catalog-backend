module.exports = ( req, res, next ) => {
    const email = req.body.email;
    if ( !( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( email ) && email.length <= 40 ) ) {
        return res.preconditionFailed( "Invalid Email format!" );
    }
    return next();
};
