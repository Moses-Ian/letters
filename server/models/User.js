const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: "You need to provide a user name!",
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: "You must provide a valid email!",
      unique: true,
      match: [
        /^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$/,
        "Please fill a valid email",
      ],
    },
    password: {
      type: String,
      required: "Please choose your password",
      unique: true,
      minLength: 5,
    },
		lastLogin: {
			type: Date,
			default: () => Date.now()
		},
		dailyHints: {
			type: Number,
			min: 0,
			default: 3
		},
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// add friends count
userSchema.virtual("friendsCount").get(function () {
  return this.friends.length;
});

// pre-save password middleware
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
