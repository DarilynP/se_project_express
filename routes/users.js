
const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");

// router.get("/", getUsers); // /users
// router.get("/:userId", getUser); // /users/:userId
// router.post("/", createUser);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);


module.exports = router;
