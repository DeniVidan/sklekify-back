import mongoose from "mongoose";
const exerciseupdateSchema = new mongoose.Schema({
  repetitions: {
    type: Number,
    required: false,
  },

});

const ExerciseUpdate = mongoose.model("exercise", exerciseupdateSchema);
export default Exercise;