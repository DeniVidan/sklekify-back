import mongoose from "mongoose";
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  imageURL: {
    type: String,
    required: false,
    default: "https://static.vecteezy.com/system/resources/previews/016/120/244/original/gym-dumbbell-cartoon-style-vector.jpg",
  },
});

const Exercise = mongoose.model("exercise", exerciseSchema);
export default Exercise;