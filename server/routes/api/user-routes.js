const router = require("express").Router();

const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
} = require("../../controllers/user-controller");

// /api/user
router.route("/").get(getAllUser).post(createUser);

// /api/user/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

router.route("/login").post(login);

router.route("/logout").post(logout);

module.exports = router;
