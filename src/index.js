import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import storage from "./memory_storage"
import cors from "cors"
import connect from "./db.js"
/* import Post from "../models/Post" */
import Exercise from "../models/Exercise";


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



/* app.get("/posts", async (req, res) => {
  let db = await connect()

  let cursor = await db.collection("posts").find().sort({postedAt: -1})
  let results = await cursor.toArray()

  console.log(results)
  res.json(results)
}); */

/* app.get("/posts", async (req, res) => {
  try {
    let exercises = await Exercise.find({});
    res.send(exercises);
  } catch (error) {
    console.log(error);
  }
});
 */

app.get("/posts", async (req, res) => {
/*   try {
    const exercises = await Exercise.find({});
    res.json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving exercises." });
  } */

  Exercise.find({}, function (err, result){ // get all albums
    if (err) { // if there will be any error
      res.status(500).json({ err: "Error retrieving exercises." });
    } else { /// in success case in which records from DB is fetched
      res.json(result);
      //console.log(result)
    }
  });
});


app.post("/post/add", async (req, res) => {
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

app.delete("/post/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Exercise.deleteOne({ _id: id });
    res.status(200).send("Successfuly deleted post!");
  } catch (error) {
    console.log(error);
  }
});



app.get("/posts_memory", (req, res) => {
  let postovi = storage.posts
  res.json(postovi)
});
app.listen(port, () => console.log(`Slušam na portu ${port}!`));
