const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const db = require("./models");
const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });
// function used to pull workouts from db, retrieves last workout for index page
app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
      .then(data => {
        res.json(data);
      })
  });

 // Routing for exercise template
app.get("/exercise", (req, res) =>{
  res.sendFile(path.join(__dirname, "./public/exercise.html"))
})
// Routing for the stats template
app.get("/stats", (req, res) =>{
  res.sendFile(path.join(__dirname, "./public/stats.html"))
})

// function to add an exercise to the current workout plan
app.put("/api/workouts/:id", (req, res) => {
  console.log(req.body);
  db.Workout.findByIdAndUpdate(
  req.params.id, 
  {
      $push: {
      exercises: req.body
  }
  }
  ).then(data => {
    console.log(data);
    res.json(data)
  });
})

// function to add a new workout plan
app.post("/api/workouts", ({ body }, res) =>{
  db.Workout.create(body).then(data =>{
    res.json(data)
    })
});

// get all workout data for stats page
app.get("/api/workouts/range", (req, res) =>{
db.Workout.find({})
.then(data => {
  res.json(data);
})
})

// display all data from Mongo DB
app.get("/all", (req, res) => {
  db.Workout.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

  

  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
  
  
  