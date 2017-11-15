const mongoose = require( "mongoose" );
const uid = require( "uid" );

const Schema = mongoose.Schema;

const reviewSchema = new Schema( {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    markedAsSpam: { type: Boolean, default: false },
} );

const movieSchema = new Schema( {
    id: { type: String, required: true },
    title: { type: String, required: true },
    director: String,
    cast: [ String ],
    categories: {
        type: String,
        enum: [ "Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi" ],
        required: true,
    },
    releaseDate: Date,
    description: { type: String, required: true },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    picture: String,
    addedBy: String, // userId / adminId
    deletedBy: String, // adminId
    deleted: { type: Boolean, default: false },
    reviews: { type: [ reviewSchema ], default: [ ] },
} );

movieSchema.methods.createMovie = ( data ) => {
    console.log( "data", data );
    console.log( "this", this );

    this.title = data.title;
    this.description = data.description;
    this.categories = data.categories;
    return this;
};

movieSchema.methods.addReview = ( body, author ) => {
    const { title, description, rating } = body;
    const review = {
        title,
        description,
        rating,
        author,
        id: uid( 10 ),
    };
    return this.reviews.push( review );
};

movieSchema.methods.addOwner = ( userId ) => {
    this.addedBy = userId;
};

movieSchema.methods.addId = ( ) => {
    this.id = uid( 10 );
};

module.exports = mongoose.model( "Movie", movieSchema );
