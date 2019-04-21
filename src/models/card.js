const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema ({
    cardname:{
        type: String,
        required: [true, 'Cardname is required.']
    },
    manaCost: {
        type: String,
        required: [true, 'Mana cost is required.']
    },
    type:{
        type: String,
        required: [true, 'Card type is required.']
    },
    subtype:{
        type: String
    },
    power:{
        type: String
    },
    toughness:{
        type: String
    },
    cardText:{
        type: String
    },
    flavorText:{
        type: String
    },
    Art:{
        type: String
    }
});
const Card = mongoose.model('card', CardSchema);

module.exports = Card;