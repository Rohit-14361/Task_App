const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Server is connected with Database"))
    .catch((error) => {
      console.log(error);
      console.log("Error while connecting with the Database");
      process.exit(0);
    });
};

module.exports=database;