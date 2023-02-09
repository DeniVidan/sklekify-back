import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
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
  imageURL: {
    type: String,
    required: false,
    default: "https://static.vecteezy.com/system/resources/previews/016/120/244/original/gym-dumbbell-cartoon-style-vector.jpg",
  },
});

const User = mongoose.model("user", userSchema);
export default User;