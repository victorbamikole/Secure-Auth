const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const morgan = require("morgan");
const connect = require("./db/conn.js");
const dotenv = require("dotenv");


// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const authRouter = require("./router/routes.js");

dotenv.config();

// Route to handle GET requests to the root URL
app.get("/", (req, res) => {
  res.status(201).json({ status: "Success" });
});

//routes
app.use("/api/", authRouter);


// Route to handle POST requests to the '/api/data' endpoint
app.post("/api/data", (req, res) => {
  const { data } = req.body;
  console.log("Received data:", data);
  res.json({ message: "Data received successfully" });
});

//check if db is connected
connect()
  .then(() => {
    try {
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error(error.message);
    }
  })
  .catch((error) => {
    console.log("Invalid database connection .....");
  });
