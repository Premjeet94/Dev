const express = require("express");
const connectDb = require("./config/db");
const app = express();
const User = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance for a user model
  const user = new User(req.body);
    try {
      await user.save();
      res.send("Data saved successfully");
    } catch (err) {
      res.status(400).send("Error in signup user:" + err.message);
    }
});

// Feed API - GET /feed - get all the users from the database

  // creating a new instance for a user model
//   const user = new User({
//     firstName: "Prem",
//     lastName: "Vivek",
//     emailId: "prem@.com",
//     password: "iuhjjk",
//     age: 22,
//     gender: "male",
//   });

//   try {
//     await user.save();
//     res.send("Data saved successfully");
//   } catch (err) {
//     res.status(400).send("Error in signup user:" + err.message);
//   }
// });

connectDb()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Connected Successfully to server");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
