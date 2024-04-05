const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path"); // Adding path module

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://chlokeshoct2006:${password}@cluster0.xnbfx7b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {});

// registration schema
const registrationschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// model of registration schema
const Registration = new mongoose.model("Registration", registrationschema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "index.html")); // Using path.join for cross-platform compatibility
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

// Correcting the path for success.html
app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "success.html"));
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "error.html"));
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

