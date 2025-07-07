import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  position: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['waiting', 'done', 'cancelled'],
    default: 'waiting'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Queue = mongoose.model('Queue', queueSchema);

export default Queue;
