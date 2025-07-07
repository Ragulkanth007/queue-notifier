import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'owner', 'manager', 'user'],
    default: 'user'
  },
  profileImage: {
    type: String,
    default: "https://as2.ftcdn.net/v2/jpg/14/12/74/21/1000_F_1412742147_9Zi2cMBHUV86lgIn9lDfkoAgf8KFr1eT.jpg"
  },
  googleId: {
    type: String
  },
  roomsOwned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const User = mongoose.model('User', userSchema);

export default User;
