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

// Feed API - Get all the data from db and show it to users
app.get("/feed", async (req, res) => {
  try {
    const allusers = await User.find({});
    if (allusers.length === 0) {
      return req.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).json(allusers);
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// Delete API - Delete the user by checking unique _id

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(400)
        .json({ message: "UserId is incorrect or user not found" });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Something Went Wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const Allowed_Updates = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Updates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if(data?.skills > 10){
      throw new Error("skills connot be more than 10");
      
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed" + err.message);
  }
});
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
