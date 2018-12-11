const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardSchema = require('./card')
const DeckSchema = new Schema ({
    username: {
        type: String,
        required: [true, 'Username is required.']
    },
    deckname: {
        type: String,
        required: [true, 'Deck name is required.']
    },
    deckList:[{
        type: CardSchema
    }]
},
{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true 
    }
});

DeckSchema.virtual('decksize').get(function(){
    if(this.deckList === undefined){
        return 0;
    }
    return this.deckList.length
})
DeckSchema.plugin(require('mongoose-autopopulate'))
const Deck = mongoose.model('deck', DeckSchema);

module.exports = Deck;