const mongoose = require( "mongoose" );
const extractObject = require( "../utilities" ).extractObject;
const jwt = require( "jsonwebtoken" );

const Admin = mongoose.model( "Admin" );
const SECRET = "superSuperSecret";

exports.register = ( req, res ) => {
    let admin = req.admin;
    if ( admin ) {
        return res.preconditionFailed( "existing_admin" );
    }
    admin = new Admin( req.body );
    admin.setPass( req.body.password );
    admin.save( ( err, savedAdmin ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedAdmin,
            [ "id", "username" ] ) );
    } );
};

exports.login = ( req, res ) => {
    const admin = req.admin;
    if ( !req.body.password ) {
        res.status( 400 ).send( "password required" );
        return;
    }

    const password = req.body.password;
    if ( admin ) {
        if ( admin.password !== password ) {
            return res.json( {
                success: false,
                message: "Authentication failed. Wrong password.",
            } );
        }

        const token = jwt.sign( admin.toObject(), SECRET, { expiresIn: 1440 } );
        return res.json( {
            success: true,
            token,
        } );
    }
    return res.json( {
        success: false,
        message: "Authentication failed. Admin not found.",
    } );
};

exports.edit = ( req, res ) => {
    const admin = req.admin;
    const { email, firstName, lastName, avatar } = req.body;

    admin.email = email;
    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.avatar = avatar;

    admin.save( ( err, savedAdmin ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( extractObject(
            savedAdmin,
            [ "id", "email", "firstName", "lastName", "avatar" ] ) );
    } );
};

exports.delete = ( req, res ) => {
    const admin = req.admin;

    admin.remove( );
    res.success( );
};
