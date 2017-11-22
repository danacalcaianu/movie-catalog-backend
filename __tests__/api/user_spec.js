const frisby = require( "frisby" );

const { Joi } = frisby;
// const user = require( "../mockData" );

const URL = "http://localhost:3030/users";

const user = {
    username: "nelutzu0mat",
    password: "v3ryS@fePswd",
    firstName: "Nelutzu",
    lastName: "Omat",
    email: "i_know_nothing@westeros.com",
    age: 23,
    gender: "male",

};

let userToken;
// const changedEmail = "changedEmail@fortech.ro";

/* eslint no-undef: off */
it( "Should be able to register a new user", ( done ) => {
    frisby
        .post( `${ URL }/registration`, user, { json: true } )
        .expect( "status", 200 )
        .expect( "header", "Content-Type", "application/json; charset=utf-8" )
        .expect( "json", "success", true )
        .expect( "json", "payload.username", user.username )
        .expect( "jsonTypes", {
            success: Joi.boolean().required(),
        } )
        .expect( "jsonTypes", "payload", {
            username: Joi.string().required(),
        } )
        .then( result => {
            const { id } = result.json.payload;
            user.id = id;
        } )
        .done( done );
} );

it( "Should be able to login with an existing user and update it", ( done ) => {
    frisby
        .post( `${ URL }/login`, {
            username: "nelutzu0mat",
            password: "v3ryS@fePswd",
        }, { json: true } )
        .expect( "status", 200 )
        .expect( "header", "Content-Type", "application/json; charset=utf-8" )
        .expect( "json", "success", true )
        .expect( "jsonTypes", {
            success: Joi.boolean().required(),
        } )
        .expect( "jsonTypes", {
            token: Joi.string().required(),
        } )
        .then( ( res ) => {
            userToken = res.json.token;
            const changedEmail = "changedEmail@fortech.ro";

            return frisby
                .put(
                    `${ URL }/${ user.id }/edit`,
                    { email: changedEmail, token: userToken },
                    { json: true },
                )
                .expect( "status", 200 )
                .expect( "header", "Content-Type", "application/json; charset=utf-8" )
                .expect( "json", "success", true, "payload.email", changedEmail )
                .then( result => {
                    user.email = result.json.payload.email;
                } );
        } )
        .done( done );
} );

it( "Should be able to not register an existing user", ( done ) => {
    frisby
        .post( `${ URL }/registration`, user, { json: true } )
        // .expect( "status", 412 )
        .expect( "status", 409 )
        .expect( "header", "Content-Type", "application/json; charset=utf-8" )
        .expect( "json", "success", false )
        .expect( "json", "error", "Email already exists!" )
        .expect( "jsonTypes", {
            success: Joi.boolean().required(),
        } )
        .expect( "jsonTypes", {
            error: Joi.string().required(),
        } )
        .done( done );
} );
