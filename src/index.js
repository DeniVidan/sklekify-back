import express, { response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import cors from "cors"

/* import Post from "../models/Post" */
import Exercise from "../models/Exercise";
import User from "../models/User"
import auth from "./auth"
import bcrypt from "bcrypt"

dotenv.config();
try {
  mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  console.log("connected!")
} catch (error) {
  console.log("error !: ", error)
}



const app = express(); // instanciranje aplikacije
const port = 3000; // port na kojem će web server slušati

app.use(cors())
app.use(express.json());



app.get("/tajna", [auth.verify], (req, res) => { 
  res.json({ message: "Ovo je tajna " + req.jwt.user.email })
});


app.get("/posts", /* w */ async (req, res) => {
  Exercise.find({}, function (err, result){ // get all albums
    if (err) { // if there will be any error
      res.status(500).json({ err: "Error retrieving exercises." });
    } else { /// in success case in which records from DB is fetched
      res.json(result);
      //console.log(result)
    }
  });
});


app.post("/post/add", /* [auth.verify], */ async (req, res) => {
  const { name, imageURL} = req.body;


  if (!name) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    let newExercise = new Exercise({
      name,
      imageURL,
    });
    await newExercise.save();
    //console.log(newExercise);
    if (newExercise) {
      return res.status(200).json({ msg: "exercise added", newExercise });
    }
  } catch (error) {
    res.status(400).json({ msg: "Invalid data", data: req.body });
  }
});

app.delete("/post/delete/:id", [auth.verify], async (req, res) => {
  try {
    const id = req.params.id;
    await Exercise.deleteOne({ _id: id });
    res.status(200).send("Successfuly deleted post!");
  } catch (error) {
    console.log(error);
  }
});

app.post('/post/update', [auth.verify], async (req, res) => {
  const { id, repValue, date } = req.body

  const repetitions = [{
    number: repValue,
    date: date
  }]

  Exercise.findOneAndUpdate({ _id: id }, { $push: { repetitions: repetitions } }, { new: true }, (error, result) => {
    if (error) return res.status(500).send(error);
    return res.status(200).send({msg: "exercise updated", result});
  });

});

app.post("/add/user", async (req, res) => {

  let { firstname, lastname, email, password } = req.body;
  let id;

  try {
    id = await auth.registerUser(firstname, lastname, email, password);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

  res.json({ id: id });



});

app.post("/auth/user", async (req, res) => {

    let user = req.body


    try {
      let result = await auth.authUser(user.email, user.password);
      res.send(result)
    } catch (error) {
      res.status(403).json({ error: error.message })
    }

  });



app.get("/users", async (req, res) => {
  
    User.find({}, function (err, result){ // get all albums
      if (err) { // if there will be any error
        res.status(500).json({ err: "Error retrieving exercises." });
      } else { /// in success case in which records from DB is fetched
        res.json(result);
        //console.log(result)
      }
    });
  });





app.listen(port, () => console.log(`Slušam na portu ${port}!`));





