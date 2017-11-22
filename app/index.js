const express = require( "express" );
const bodyParser = require( "body-parser" );
const helmet = require( "helmet" );
const config = require( "./config" );
const customResponses = require( "./middlewares/customResponses" );

const app = express( );
const port = process.env.PORT || config.port;
const ENV = process.env.NODE_ENV || config.env;

app.set( "env", ENV );

require( "./models/user" );
require( "./models/admin" );
require( "./models/movie" );

app.use( bodyParser.json( ) );
app.use( customResponses );
app.use( helmet() );

require( "./config/mongoose" )( app );
require( "./config/routes" )( app );

app.listen( port );
