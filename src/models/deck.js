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

DeckSchema.virtual('Decksize').get(function(){
    if(this.deckList === undefined){
        return 0;
    }
    return this.deckList.length
})
DeckSchema.plugin(require('mongoose-autopopulate'))
const Deck = mongoose.model('deck', DeckSchema);

module.exports = Deck;