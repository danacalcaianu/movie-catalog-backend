module.exports = ( ) => ( req, res, next ) => {
    const user = req.user;
    if ( user.deleted === true || user.blocked === true ) {
        return res.forbidden();
    }
    next();
};
