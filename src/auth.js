import mongo from "mongodb";
import User from "../models/User";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
try {
  mongoose.set("strictQuery", false).connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });
  console.log("connected!");
} catch (error) {
  console.log("error !: ", error);
}

export default {
  async registerUser(firstname, lastname, email, password) {
    let newUser = new User({
      firstname,
      lastname,
      email,
      password: await bcrypt.hash(password, 8),
    });

    try {
      let result = await newUser.save();
      if (result && result.insertedId) {
        return result.insertedId;
      }
    } catch (e) {
      throw new Error("Korisnik postoji!");
    }
  },

  async authUser(email, password) {
    let user = await User.findOne({ email });
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      delete user.password;
      let token = jwt.sign({ user }, process.env.JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "1 week",
      });

      return {
        token,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      /* console.log("TOČNO!") */
    } else {
      throw new Error("Nemože autentificirati!");
    }
  },

  verify(req, res, next) {
    try {
      let authorization = req.headers.authorization.split(" ");
      let type = authorization[0];
      let token = authorization[1];
      //console.log(token);
      if (type !== "Bearer") {
        return res.status(401).send();

      } else {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET);
        return next()
      }
    } catch (error) {
      return res.status(401).send()
    }
  },

  async changeUserPassword(req, new_password, old_password, image){
  
    let { user } = req.jwt
    let newUser = await User.findOne({ _id: user._id });
    if (newUser && user.password && (await bcrypt.compare(old_password, user.password))){
      let new_password_hashed = await bcrypt.hash(new_password, 8)

      let result = await User.updateOne(
        { _id: user._id },
        {
          $set: {
            password: new_password_hashed,
            imageURL:image
          }
        }
      )

      return result.modifiedCount == 1

    }
  }
};
