const frisby = require( "frisby" );

const { Joi } = frisby;
const URL = "http://localhost:3030/movies";

/* eslint no-undef: off */
it( "Should be able to get all movies", ( done ) => {
    frisby
        .get( `${ URL }/getAll`, { json: true } )
        .expect( "status", 200 )
        .expect( "header", "Content-Type", "application/json; charset=utf-8" )
        .expect( "json", "success", true )
        .expect( "jsonTypes", {
            success: Joi.boolean().required(),
        } )
        .done( done );
} );
//
// it( "Should be able to get a movie by id", ( done ) => {
//     frisby
//         .get( `${ URL }/getMovie`, { json: true } )
//         .expect( "status", 200 )
//         .expect( "header", "Content-Type", "application/json; charset=utf-8" )
//         .expect( "json", "success", true )
//         .expect( "jsonTypes", {
//             success: Joi.boolean().required(),
//         } )
//         .done( done );
// } );
