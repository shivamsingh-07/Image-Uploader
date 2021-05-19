const express = require("express");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const upload = multer({ storage: multer.diskStorage({}) });
require("ejs");
if (process.env.NODE_ENV != "production") require("dotenv").config();

// Initializing App
const app = express();

// Configuring Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setting View Engine
app.set("view engine", "ejs");

// Defining Routes
app.get("/", (req, res) => {
    res.render("index.ejs", {
        message: "",
        image: "https://source.unsplash.com/random/500x500",
    });
});

app.post("/", upload.single("avatar"), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (err, data) => {
        if (err)
            return res.render("index.ejs", {
                message: err.message,
                image: "https://source.unsplash.com/random/500x500",
            });
        res.render("index.ejs", { message: "Image Uploaded!", image: data.secure_url });
    });
});

// Starting App
const PORT = process.env.PORT || "5000";
app.listen(PORT, () => console.log("Starting on port " + PORT));
