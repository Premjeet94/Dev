const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.post("/user/login", (req,res) => {
    res.send("user logged in successfully")
});

app.get("/user/data", userAuth, (req,res) => {
    res.send("User data sent");
});

app.get("/admin/getdata", (req,res) => {
    res.send("All data sent");
})




app.listen(3000, () => {
    console.log("Connected Successfully to server");
});


