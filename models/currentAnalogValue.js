const mongoose = require('mongoose');

const currentAnalogValSchema = new mongoose.Schema({
  name: String,
  current_date: String,
  value: String,
});

module.exports = mongoose.model('currentAlalogval', currentAnalogValSchema);