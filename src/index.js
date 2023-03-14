import express, { response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import cors from "cors";

/* import Post from "../models/Post" */
import Exercise from "../models/Exercise";
import User from "../models/User";
import auth from "./auth";
import bcrypt from "bcrypt";



dotenv.config();
try {
  mongoose.set("strictQuery", false).connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });
  console.log("connected!");
} catch (error) {
  console.log("error !: ", error);
}

const app = express(); // instanciranje aplikacije
const port = process.env.PORT; // port na kojem će web server slušati

app.use(cors());
app.use(express.json({ limit: "1mb" }));





app.get("/tajna", [auth.verify], (req, res) => {
  res.json({ message: "Ovo je tajna " + req.jwt.user.email });
});

app.get("/posts", [auth.verify], async (req, res) => {
  const { user } = req.jwt;


  Exercise.find({ user: user._id }, function (err, result) {
    // get all albums
    if (err) {
      // if there will be any error
      res.status(500).json({ err: "Error retrieving exercises." });
    } else {
      /// in success case in which records from DB is fetched
      res.json(result);
      //console.log(result)
    }
  });
});

app.post("/post/add", [auth.verify], async (req, res) => {
  const { name, imageURL } = req.body;
  const { user } = req.jwt;

  if (!name) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    let newExercise = new Exercise({
      name,
      imageURL,
      user: user._id,
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

app.post("/post/update", [auth.verify], async (req, res) => {
  const { id, repValue, date } = req.body;

  const repetitions = [
    {
      number: repValue,
      date: date,
    },
  ];

  Exercise.findOneAndUpdate(
    { _id: id },
    { $push: { repetitions: repetitions } },
    { new: true },
    (error, result) => {
      if (error) return res.status(500).send(error);
      return res.status(200).send({ msg: "exercise updated", result });
    }
  );
});


app.put("/user/edit", [auth.verify], async (req, res) => {
  let changes = req.body
  console.log("changes: ", changes)
  /* let email = req.jwt */

  if (changes.new_password && changes.old_password){
    let result = await auth.changeUserPassword(req, changes.new_password, changes.old_password, changes.imageURL)
    if (result) {
      res.status(201).send({ msg: "succesfuly edited name" })
    }
    else {
      res.status(500).json({ error: "cannot change password" })
    }
  }
  else{
    res.status(400).json({error: "krivi upit"})
  }
})

app.put("/user/edit/fname", [auth.verify], async (req, res) => {
  let changes = req.body
  console.log("changes: ", changes)
  /* let email = req.jwt */

  if (changes.firstname){
    let result = await auth.changeUserFname(req, changes.firstname, changes.lastname)
    if (result) {
      res.status(201).send()
    }
    else {
      res.status(500).json({ error: "cannot change password" })
    }
  }
  else{
    res.status(400).json({error: "krivi upit"})
  }
})

app.put("/user/edit/image", [auth.verify], async (req, res) => {
  let changes = req.body
  console.log("changes: ", changes)
  /* let email = req.jwt */

  if (changes.imageURL){
    let result = await auth.changeUserImage(req, changes.imageURL)
    if (result) {
      res.status(201).send()
    }
    else {
      res.status(500).json({ error: "cannot change password" })
    }
  }
  else{
    res.status(400).json({error: "krivi upit"})
  }
})


app.post("/add/user", async (req, res) => {
  let { firstname, lastname, email, password } = req.body;

  try {
    let result = await auth.registerUser(firstname, lastname, email, password);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "User with this email already exisits" });
  }

});

app.post("/auth/user", async (req, res) => {
  let user = req.body;

  try {
    let result = await auth.authUser(user.email, user.password);
    res.send(result);
  } catch (error) {
    res.status(403).send(error);
    console.log(error.message)
  }
});

app.get("/users", [auth.verify],  async (req, res) => {
  let { user } = req.jwt
  let newUser = await User.findOne({_id: user._id});
    // get all albums
    if (newUser) {
      // if there will be any error
      res.send(newUser);
      console.log("usserr gettt: ", newUser)
    } else {
      /// in success case in which records from DB is fetched
      
      res.status(500).json("Error retrieving user.");
      
    }
  
});


app.get("/exercise/data", [auth.verify], async (req, res) => {
  const { user } = req.jwt;


  Exercise.find({ user: user._id }, function (err, result) {
    // get all albums
    if (err) {
      // if there will be any error
      res.status(500).json({ err: "Error retrieving exercises." });
    } else {
      /// in success case in which records from DB is fetched
      res.json(result);
      //console.log(result)
    }
  });
});



app.listen(port, () => console.log(`Slušam na portu ${port}!`));
