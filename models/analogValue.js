const mongoose = require('mongoose');

const analogValSchema = new mongoose.Schema({
  name: String,
  current_date: String,
  value: String,
});

module.exports = mongoose.model('alalogval', analogValSchema);