const express = require("express");
const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/eggyDB";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { User } = require('../models/db.js'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, 'src', 'public', 'images');

// Check if the directory exists, create it if it doesn't
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}


async function connectToDB() {
  try {
    const client = await MongoClient.connect(uri);
    return client.db("eggyDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function getData(collectionName, query = {}) {
  try {
    const db = await connectToDB();
    const collection = db.collection(collectionName);
    return await collection.find(query).toArray();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
function cutShort(sentence) {
  let newSentence = sentence;

  if (sentence.length > 120) {
    newSentence = sentence.slice(0, 120) + "...";
  }

  return newSentence;
}

module.exports = function (app, app_data) {
  //Data Models or Schemas
  const restoModel = app_data["restoModel"];
  const userModel = app_data["userModel"];
  const feedbackModel = app_data["feedbackModel"];
  const commentModel = app_data["commentModel"];

  const { check, body, validationResult } = require("express-validator");

  let loginInfo;

  // Function to load server data
  async function loadServer(req, res, data) {
    try {
      //used the Mini Challenge 3 as reference to retrieve data
      const resto = await restoModel.find({}).lean();
      const searchQuery = { restoName: resto[0].restoName };
      const comments = await commentModel.find(searchQuery).lean();

      // const users = await userModel.find({}, 'username email').lean();
      // console.log(users);

      for (let i = 0; i < comments.length; i++) {
        let ratingCountArray = [];
        comments[i].content = cutShort(comments[i].content);
        for (let j = 0; j < comments[i]["overall-rating"]; j++) {
          ratingCountArray.push(j);
        }
        comments[i]["ratingCount"] = ratingCountArray;
      }

      res.render("main", {
        layout: "index",
        title: "My Home page",
        restoData: resto,
        loginData: data,
        commentData: comments,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Error fetching data");
    }
  }
  // Connect to MongoDB
  connectToDB().catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

  // Routes
  app.get("/", (req, res) => {
    console.log(loginInfo);
    loadServer(req, res, loginInfo);
  });

  app.post("/update-image", async (req, res) => {
    try {
      const images = await restoModel.find({}).lean();

      let i = Number(req.body.input);
      //console.log(`Current index ${i}`);

      //get restoName first
      const restoNames = await restoModel.find({}, "restoName").lean();

      //get restaurant comments based on restaurant names from restoNames
      let resto1 = await commentModel
        .find({ restoName: restoNames[0].restoName })
        .lean();
      let resto2 = await commentModel
        .find({ restoName: restoNames[1].restoName })
        .lean();
      let resto3 = await commentModel
        .find({ restoName: restoNames[2].restoName })
        .lean();
      let resto4 = await commentModel
        .find({ restoName: restoNames[3].restoName })
        .lean();
      let resto5 = await commentModel
        .find({ restoName: restoNames[4].restoName })
        .lean();

      // console.log(`${restoNames[0].restoName}: ${resto1.length}`);
      // console.log(`${restoNames[1].restoName}: ${resto2.length}`);
      // console.log(`${restoNames[2].restoName}: ${resto3.length}`);
      // console.log(`${restoNames[3].restoName}: ${resto4.length}`);
      // console.log(`${restoNames[4].restoName}: ${resto5.length}`);

      //fetching the current restaurant
      let currentComment = {};
      switch (i) {
        case 0:
          currentComment = resto1;
          break;
        case 1:
          currentComment = resto2;
          break;
        case 2:
          currentComment = resto3;
          break;
        case 3:
          currentComment = resto4;
          break;
        case 4:
          currentComment = resto5;
          break;
      }

      //making the stars for the homepage
      for (let i = 0; i < currentComment.length; i++) {
        let ratingCountArray = [];
        currentComment[i].content = cutShort(currentComment[i].content);
        for (let j = 0; j < currentComment[i]["overall-rating"]; j++) {
          ratingCountArray.push(j);
        }
        currentComment[i]["ratingCount"] = ratingCountArray;
      }

      if (currentComment == null) {
        currentComment = null;
      }

      console.log(`Restaurant: ${restoNames[i].restoName}`);

      res.send({
        index: i,
        url: images[i].restoPic,
        title: images[i].restoName,
        commentData: currentComment,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });

  app.get("/restaurants", async (req, res) => {
    try {
        const { stars, query } = req.query;
        let filter = {};
  
        
        if (query) {
            filter = {
                $or: [
                    { restoName: { $regex: new RegExp(query, "i") } },
                    { description: { $regex: new RegExp(query, "i") } }
                ]
            };
        }
  
        // Handle star ratings
        if (stars) {
            const starsArray = Array.isArray(stars) ? stars.map(Number) : [Number(stars)];
            if(filter.$or) {
                filter = { $and: [{ main_rating: { $in: starsArray } }, filter] };
            } else {
                filter.main_rating = { $in: starsArray };
            }
        }
  
        const restaurants = await getData("restaurants", filter);
        const restaurant_row1 = restaurants.slice(0, 3);
        const restaurant_row2 = restaurants.slice(3, 6);
        const restaurant_row3 = restaurants.slice(6);
  
        
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.render("partials/establishments", {
                layout: false,
                restaurant_row1,
                restaurant_row2,
                restaurant_row3,
                loginData: loginInfo
            });
        } else {
            res.render("view-establishment", {
                layout: "index",
                title: "View Establishments",
                restaurant_row1,
                restaurant_row2,
                restaurant_row3,
                loginData: loginInfo,
            });
        }
    } catch (error) {
        console.error("Error fetching establishments:", error);
        res.status(500).send("Internal Server Error");
    }
  });
  // Route to create a new user
  app.post(
    "/create-user",
    [
      check("email1").isEmail(),
      check("sign2").isLength({ min: 5, max: 15 }),
      check("pass1").notEmpty(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send("Try Again");
        }

        const client = await MongoClient.connect(uri);
        const dbo = client.db("eggyDB");
        const collName = dbo.collection("users");

        const users = await userModel.find({}, "username email").lean();

        const email_ = String(req.body.email1);
        const username_ = String(req.body.sign2);

        //checks for duplicate
        for (let i = 0; i < users.length; i++) {
          if (
            (users[i].email === email_ && users[i].username === username_) ||
            users[i].email === email_ ||
            users[i].username === username_
          ) {
            return res.status(400).send("Duplicate Entry. Try Again.");
          }
          if (req.body.pass1 != req.body.firstpass) {
            return res.status(400).send("Password does not match");
          }
        }

        let encrypted_pass = "";

        bcrypt.hash(req.body.pass1, saltRounds, async function (err, hash) {
          encrypted_pass = hash;
          console.log("Encrypted Password: " + encrypted_pass);

          const userInfo = {
            email: req.body.email1,
            username: req.body.sign2,
            password: encrypted_pass,
            avatar_img: "./images/profile-pic.png",
            description: "",
            __v: 0,
          };

          console.log(userInfo);

          await collName.insertOne(userInfo);
          res.redirect(`/`);
        });
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  // Route to login user
  app.post("/read-user", async (req, res) => {
    try {
      const client = await MongoClient.connect(uri);
      const dbo = client.db("eggyDB");
      const collName = dbo.collection("users");

      const searchQuery = {
        username: req.body.userlogin,
        password: req.body.passlogin,
      };

      let current_hashed_password = "";

      const username = await userModel
        .findOne({ username: req.body.userlogin })
        .lean();

      bcrypt.hash(req.body.passlogin, saltRounds, async function (err, hash) {
        current_hashed_password = hash;

        const userInfo = await userModel
          .findOne({
            username: req.body.userlogin
          })
          .lean();

          console.log(userInfo);

        if (userInfo) {
          loginInfo = {
            username: req.body.userlogin,
            password: req.body.passlogin,
          };
          res.redirect("/");
        } else {
          loginInfo = null;
          res.redirect("/");
        }
      });
    } catch (error) {
      console.error("Error reading user:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Route to logout user
  app.post("/logout-user", (req, res) => {
    loginInfo = null;
    loadServer(req, res, null);
  });

  const createArray = (N) => {
    return [...Array(N).keys()].map((i) => i + 1);
  };
app.get("/userProfile", async (req, res) => {
  try {
    const username = loginInfo.username;
    // Fetch data for comments, users, and restaurants concurrently
    const [comments, users, restaurants] = await Promise.all([
      getData("comments", { name: username }), // Filter comments by name
      getData("users", { username: username }), // Filter users by username
      getData("restaurants", {}), // Fetch all restaurants
    ]);

    const createArrays = (comment) => {
      comment["food-stars"] = createArray(comment["food-rating"]);
      comment["service-stars"] = createArray(comment["service-rating"]);
      comment["ambiance-stars"] = createArray(comment["ambiance-rating"]);
      comment["overall-stars"] = createArray(comment["overall-rating"]);
    };

    const createRestaurantArrays = (restaurant) => {
      restaurant["rating-stars"] = createArray(restaurant["main_rating"]);
    };

    comments.forEach(createArrays);
    restaurants.forEach(createRestaurantArrays);
    console.log("These are the users");
    console.log(users);
    console.log("Data fetched successfully");

    // Render user profile page with data
    res.render("user-profile", {
      layout: "user-layout",
      title: "User Profile",
      commentData: comments,
      userData: [users[0]], // Assuming users variable is defined somewhere
      restoData: restaurants,
      loginData: loginInfo
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'images')); // Adjust based on actual structure
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

app.post('/update-profile', upload.single('img'), async (req, res) => {
  const { username: newUsername, email, password, description } = req.body;
  const avatarImgPath = req.file ? path.join('/images', req.file.filename) : undefined;
  const currentUsername = loginInfo.username;

  try {
    const user = await User.findOne({ username: currentUsername });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Dynamically create an update object
    let updateData = {};
    if (newUsername) updateData.username = newUsername;
    if (email) updateData.email = email;
    
    // Only hash the password if it's provided
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }
    
    if (avatarImgPath) updateData.avatar_img = avatarImgPath;
    if (description) updateData.description = description;

    // Perform the update only if updateData is not empty
    if (Object.keys(updateData).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });
      if (updatedUser) {
        // Optionally update loginInfo if the username changes
        if (newUsername) loginInfo.username = newUsername;
        res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
      } else {
        res.status(404).json({ success: false, message: 'Update failed' });
      }
    } else {
      res.json({ success: false, message: 'No update information provided' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

app.post('/delete-account', async (req, res) => {
  if (!loginInfo) {
    // This condition checks if there's a user logged in
    return res.status(403).json({ success: false, message: "No user logged in." });
  }
  
  const currentUsername = loginInfo.username; // Get the username of the logged-in user
  
  try {
      const result = await User.deleteOne({ username: currentUsername });
      if (result.deletedCount === 0) {
          return res.json({ success: false, message: "Failed to delete account." });
      }

      // Clear the loginInfo as the account has been successfully deleted
      loginInfo = null;

      // Since this route handles AJAX requests, we can't directly use res.redirect here
      // Instead, we send a response indicating success and handle the redirection on the client side
      res.json({ success: true, message: "Account deleted successfully.", redirectTo: '/' });
  } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ success: false, message: 'Error deleting account' });
  }
});





};
