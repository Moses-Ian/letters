const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/letters_db'; 
mongoose.connect(process.env.MONGODB_URI || uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('debug', false);

module.exports = mongoose;