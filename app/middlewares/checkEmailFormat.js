/* eslint no-useless-escape: off */
module.exports = ( req, res, next ) => {
    const { email } = req.body;
    console.log( email );
    if ( !( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( email ) && email.length <= 40 ) ) {
        return res.preconditionFailed( "Invalid Email format!" );
    }
    return next();
};
