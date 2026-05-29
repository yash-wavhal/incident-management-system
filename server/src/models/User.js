import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['ADMIN', 'RESPONDER'],
      default: 'RESPONDER',
    },

    team: {
      type: String,
      enum: ['INFRA', 'APPLICATION'],
      default: 'APPLICATION',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
