const express = require("express");

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

router.post("/:id/posts", [validateUserId, validatePost], (req, res) => {
  const newPost = {
    user_id: req.params.id,
    text: req.body.text,
  };
  Posts.insert(newPost)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ message: "Wow, not gonna happen" });
    });
});

router.get("/", (req, res) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(404).json({ message: "Wow, not gonna happen" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.user.id)
    .then((posts) => {
      console.log(posts);
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Wow, not gonna happen" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.user.id)
    .then(() => {
      res.status(200).json({ message: "successfully deleted user" });
    })
    .catch(() => {
      res.status(500).json({ message: "Wow, not gonna happen" });
    });
});

router.put("/:id", [validateUserId, validateUser], (req, res) => {
  Users.update(req.params.id, req.body)
    .then(() => {
      res.status(200).json({
        message: `successfully updated user with id ${req.params.id}`,
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then((data) => {
      if (data) {
        req.user = data;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Wow, not gonna happen" });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json("missing user data");
  } else if (!req.body.name) {
    res.status(400).json("missing required name field");
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json("missing post data");
  } else if (!req.body.text) {
    res.status(400).json("missing required text field");
  } else {
    next();
  }
}

module.exports = router;
