const { Schema, model } = require("mongoose");

const friendSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: 'Users'},
  recipient: { type: Schema.Types.ObjectId, ref: 'Users'},
  status: {
    type: String,
    enums: [
      'add friend',
      'requested',
      'received',
      'friends',
			'blocked'
    ]
  }
}, {timestamps: true})

const Friend = model("Friend", friendSchema);

module.exports = Friend;