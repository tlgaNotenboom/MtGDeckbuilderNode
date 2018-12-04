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
        type: Number
    },
    toughness:{
        type: Number
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

CardSchema.plugin(require('mongoose-autopopulate'))
const Card = mongoose.model('card', CardSchema);

module.exports = Card;