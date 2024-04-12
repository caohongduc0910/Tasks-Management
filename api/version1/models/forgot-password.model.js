const mongoose = require('mongoose')
const generate = require('../../../helpers/generate.helper')

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 1800
    }
  }
)

const forgotPassword = mongoose.model('forgotPassword', forgotPasswordSchema, 'forgot-password')

module.exports = forgotPassword 