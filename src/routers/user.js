const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();

// register a user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    res.send({ user, token });
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get all users
router.get("/users", authMiddleware, async (req, res) => {
  res.send(req.user);
});

//get user by id
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("user not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

//update a user
router.patch("/users/me", authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  // const _id = req.params.id;
  try {
    const user = req.user;

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    // if (!user) {
    //   return res.status(404).send();
    // }

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//delete a user
router.delete("/users/me", authMiddleware, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(0);
  }
});

//log in user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

//log out user

router.post("/users/logout", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    console.log("RU", req.user);
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = [];
    let user = await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

const upload = multer({
  // dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.endsWith(".jpg") &&
      !file.originalname.endsWith(".jpeg") &&
      !file.originalname.endsWith(".png")
    ) {
      return cb(new Error("file must be of type jpg"));
    }

    return cb(undefined, true);
    // cb(new Error("file must be jpg"))  // trow error
    // cd(undefined, true) // accept the call back
    // cd(undefined, false) // reject the call back
  },
});

router.post(
  "/users/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    // .resize()

    // can access file propery only if you don't have dest propery in the multer options
    // provide this in img url to show the image with binary "data data:image/jpg;base64,/9j/4AA..."
    req.user.avatar = buffer; //req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", authMiddleware, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send(200);
});

// just add localhost:300/uers/id2342424/avatar to img tag src attribute will automaticly fetch the picture
router.get("/users/:id/avatar", async (req, res) => {
  console.log("inside");
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
