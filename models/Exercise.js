import mongoose from "mongoose";
import User from "./User";
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  repetitions: [
    {
      number: {
        type: Number,
        required: false,
        default: 0,
      },
    },
    
  ],

  imageURL: {
    type: String,
    required: false,
    default:
      "https://static.vecteezy.com/system/resources/previews/016/120/244/original/gym-dumbbell-cartoon-style-vector.jpg",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  }
},
{ timestamps: true }
);

const Exercise = mongoose.model("exercise", exerciseSchema);
export default Exercise;
