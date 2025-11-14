const express = require("express");
const connectDb = require("./config/db");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
app.use(express.json());
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const jwt = require("jsonwebtoken");

// {
//    "emailId": "premjetvie34@gmail.com",
//    "password": "Prem098@2123"
// }
app.post("/signup", async (req, res) => {
  try {
    //Validation of the data
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password

    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance for a user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("Data saved successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Please enter correct Email Id");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //Create a JWt token
      const token = await jwt.sign(
        { _id: user._id },
        "yddttfuytf878768jhhg868%^^89gxc788ggiud"
      );
      console.log(token);

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);

      res.send("Login successfull!");
    } else throw new Error("Invalid CREDENTIALS");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }
    //validating token

    const decodedMessage = await jwt.verify(
      token,
      "yddttfuytf878768jhhg868%^^89gxc788ggiud"
    );
    const { _id } = decodedMessage;
    console.log("Logged In user is: " + _id);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Please login again");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
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
    const Allowed_Updates = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Updates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills > 10) {
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
