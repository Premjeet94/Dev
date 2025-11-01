const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://PremDb:NZi98MbTXCt4nvX0@devtinder.p9nsccy.mongodb.net/"
  );
};

module.exports = connectDb;
