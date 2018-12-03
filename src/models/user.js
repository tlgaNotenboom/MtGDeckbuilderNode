const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Name is required.']
      },
      password: {
        type: String,
        validate: {
          validator: (password) => password.length > 2,
          message: 'Password must be longer than 2 characters.'
        },
        required: [true, 'Password is required.']
      },
      decks: [{
        type: Schema.Types.ObjectId,
        ref: 'deck'
      }]
    },
    {usePushEach:true});

const User = mongoose.model('user', UserSchema);

module.exports = User;
    