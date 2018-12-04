const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        type: Schema.Types.ObjectId, 
        ref: 'card',
        autopopulate: true
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

DeckSchema.virtual('Deck size').get(function(){
    if(this.deckList === undefined){
        return 0;
    }
    return this.deckList.length
})

const Deck = mongoose.model('deck', DeckSchema);

module.exports = Deck;