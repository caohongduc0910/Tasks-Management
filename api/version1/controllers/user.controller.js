const User = require('../models/user.model')
const ForgotPassword = require('../models/forgot-password.model')

const md5 = require('md5')
const sendMail = require("../../../helpers/sendMail.helper")
const generate = require('../../../helpers/generate.helper')


// [POST] /user/register
module.exports.register = async (req, res) => {
  const existEmail = await User.findOne({
    deleted: false,
    status: "active",
    email: req.body.email
  })

  if (!existEmail) {
    req.body.password = md5(req.body.password)
    const token = generate.generateRandomString(20)
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      tokenUser: token 
    })
    await newUser.save()

    res.json({
      msg: "Tạo tài khoản thành công",
      user: newUser
    })
    return
  }

  res.json({
    msg: "Tạo tài khoản thất bại",
  })
}

// [POST] /user/login
module.exports.login = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({
    status: "active",
    deleted: false,
    email: email
  })

  if (!user) {
    res.json({
      msg: "Sai email"
    })
    return
  }

  if (md5(password) != user.password) {
    res.json({
      msg: "Sai mật khẩu"
    })
    return
  }
  if (user.status == "inactive") {
    res.json({
      msg: "Tài khoản bị khóa"
    })
    return
  }

  res.cookie("tokenUser", user.tokenUser)
  res.json({
    msg: "Đăng nhập thành công"
  })
}

// [POST] /user/password/forgot
module.exports.forgot = async (req, res) => {
  const email = req.body.email

  if (!email) {
    res.json({
      msg: "Email không tồn tại"
    })
    return
  }

  const forgotPasswordObject = {
    email: email,
    otp: generate.generateRandomNumber(6),
    expireAt: new Date()
  }
  const newForgotPasswordObject = new ForgotPassword(forgotPasswordObject)
  newForgotPasswordObject.save()

  const subject = "Mã OTP của bạn"
  const text = `Mã xác minh lấy lại mật khẩu là <b>${newForgotPasswordObject.otp}</b>. Mã có hiệu lực trong vòng 3 phút. 
  Lưu ý không được để lộ mã OTP!`
  sendMail.sendMailOTP(newForgotPasswordObject.email, subject, text)

  res.json({
    msg: "Lấy OTP thành công"
  })
}

// [POST] /user/password/otp
module.exports.otp = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp

  const forgotPasswordObject = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })

  if (forgotPasswordObject) {
    const user = await User.findOne({
      email: email
    })

    res.cookie("tokenUser", user.tokenUser)

    res.json({
      msg: "OTP đúng nha"
    })
  }
  else {
    res.json({
      msg: "Sai OTP"
    })
  }
}

// [POST] /user/password/reset
module.exports.reset = async (req, res) => {
  const password = req.body.password
  const passwordConfirm = req.body.passwordConfirm
  console.log(password, passwordConfirm, req.cookies.tokenUser)
  if (password != passwordConfirm) {
    res.json({
      msg: "Mật khẩu xác nhận không khớp"
    })
    return
  }
  else {
    await User.updateOne(
      {
        tokenUser: req.cookies.tokenUser,
      },
      {
        password: md5(req.body.password)
      }
    )

    res.json({
      msg: "Đổi mật khẩu thành công"
    })
  }
}

// [GET] /user/detail
module.exports.detail = async (req, res) => {
  const user = req.user

  if (user) {
    res.json({
      user: user,
      msg: "Lấy thông tin chi tiết thành công"
    })
  }
  else {
    res.json({
      msg: "Người dùng không tồn tại"
    })
  }
}

//[GET] /user/list
module.exports.list = async (req, res) => {
  const users = await User.find({
    deleted: false,
    status: "active"
  }).select("fullName email")

  res.json({
    msg: "Lấy danh sách thành công",
    list: users
  })
}