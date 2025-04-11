const router = require("express").Router()
const { getUsers, getUser, createUser } = require("../controllers/users")
const mongoose = require("mongoose");


router.get("/", getUsers); // /users
router.get("/:userId", getUser); // /users/:userId
router.post("/", createUser);

module.exports = router;