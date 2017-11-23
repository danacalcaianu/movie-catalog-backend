const frisby = require( "frisby" );

const { Joi } = frisby;
const mongoose = require( "mongoose" );

mongoose.Promise = global.Promise;

const { userSchema } = require( "../../app/models/user" );
const { movieSchema } = require( "../../app/models/movie" );

const User = mongoose.model( "User", userSchema );
const Movie = mongoose.model( "Movie", movieSchema );

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

const movie = {
    title: "Baby Driver",
    description: "has good music",
    categories: "Comedy",
    director: "Edgar Wright",
};

let userToken;
const changedEmail = "changedEmail@fortech.ro";
const invalidUser = Object.assign( {}, user, { email: changedEmail } );

describe( "User", () => {
    afterAll( () => {
        User
            .find( { username: user.username } )
            .remove()
            .exec( ( err, found ) => {
                console.log( "here>" );
                console.log( found );
            } );
        Movie
            .find( { title: movie.title } )
            .remove()
            .exec( ( err, found ) => {
                console.log( found );
            } );
    } );
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

    it( "Should be able to not register an existing user", ( done ) => {
        frisby
            .post( `${ URL }/registration`, invalidUser, { json: true } )
            .expect( "status", 412 )
            // .expect( "status", 409 )
            .expect( "header", "Content-Type", "application/json; charset=utf-8" )
            .expect( "json", "success", false )
            .expect( "json", "error", "existing_user" )
            .expect( "jsonTypes", {
                success: Joi.boolean().required(),
            } )
            .expect( "jsonTypes", {
                error: Joi.string().required(),
            } )
            .done( done );
    } );

    it( "Should be able to login with an existing user", ( done ) => {
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
                Object.assign( movie, { token: userToken } );
            } )
            .done( done );
    } );

    it( "Should be able to modify a logged in user", ( done ) => {
        frisby
            .put(
                `${ URL }/${ user.id }/edit`,
                { email: changedEmail, token: userToken },
                { json: true },
            )
            .expect( "status", 200 )
            .expect( "header", "Content-Type", "application/json; charset=utf-8" )
            .expect( "json", "success", true )
            .expect( "json", "payload.email", changedEmail )
            .then( result => {
                user.email = result.json.payload.email;
            } )
            .done( done );
    } );

    it( "Should be able to add a movie and edit it", ( done ) => {
        frisby
            .put(
                `${ URL }/${ user.id }/addMovie`,
                movie,
                { json: true },
            )
            .expect( "status", 200 )
            .expect( "header", "Content-Type", "application/json; charset=utf-8" )
            .expect( "json", "success", true )
            .expect( "json", "payload.title", movie.title )
            .then( ( res ) => {
                movie.id = res.json.payload.id;

                return frisby
                    .put(
                        `${ URL }/${ user.id }/editMovie/${ movie.id }`,
                        { categories: "Action", token: userToken },
                        { json: true },
                    )
                    .expect( "status", 200 )
                    .expect( "header", "Content-Type", "application/json; charset=utf-8" )
                    .expect( "json", "success", true )
                    .expect( "json", "payload.categories", "Action" );
            } )
            .done( done );
    } );

    it( "Should be able to not add a movie with missing parameters", ( done ) => {
        frisby
            .put(
                `${ URL }/${ user.id }/addMovie`,
                { title: "mock title", description: movie.description, token: userToken },
                { json: true },
            )
            .expect( "status", 422 )
            .expect( "header", "Content-Type", "application/json; charset=utf-8" )
            .expect( "json", "success", false )
            .expect( "json", "error", "unprocessable_entity" )
            .done( done );
    } );

    it( "Should be able to add a review for a movie and then delete it", ( done ) => {
        frisby
            .put(
                `${ URL }/${ user.id }/reviewMovie/${ movie.id }`,
                {
                    title: "pretty good",
                    description: "i thought it was funny and had great music",
                    author: user.id,
                    rating: 4.5,
                    token: userToken,
                },
                { json: true },
            )
            .expect( "status", 200 )
            .expect( "header", "Content-Type", "application/json; charset=utf-8" )
            .expect( "json", "success", true )
            .expect( "jsonTypes", {
                success: Joi.boolean().required(),
            } )
            .then( res => {
                let { reviews } = res.json.payload;
                let index = reviews.map( review => review.author ).indexOf( user.username );
                const { rating, id } = reviews[ index ];
                expect( rating ).toEqual( 4.5 );

                return frisby
                    .del(
                        `${ URL }/${ user.id }/${ movie.id }/removeReview/${ id }`,
                        { headers: { "x-access-token": userToken } },
                    )
                    .expect( "status", 200 )
                    .expect( "header", "Content-Type", "application/json; charset=utf-8" )
                    .expect( "json", "success", true )
                    .then( response => {
                        ( { reviews } = response.json.payload );
                        index = reviews.map( review => review.id ).indexOf( id );
                        expect( index ).toEqual( -1 );
                    } );
            } )

            .done( done );
    } );
} );
