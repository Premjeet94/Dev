const mongoose = require("mongoose");

const connectDb = async () => {
await mongoose.connect(
"mongodb+srv://PremDb:NZi98MbTXCt4nvX0@devtinder.p9nsccy.mongodb.net/");
};

connectDb().then(() => {
 console.log("DB connection established");
})
.catch(err=>{
 console.log("Database connection failed");
});