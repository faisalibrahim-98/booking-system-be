const skillsRouter = require("./routers/skills");
const shiftsRouter = require("./routers/shifts");
const userRouter = require("./routers/user");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const uri =
  "mongodb+srv://admin:admin@cluster0.azk9nco.mongodb.net/?retryWrites=true&w=majority";

// Defining connection to database.
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to Mongodb");
  } catch (error) {
    console.log(error);
  }
}

// Initiating connection to databse.
connect();

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(userRouter);
app.use(skillsRouter);
app.use(shiftsRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
