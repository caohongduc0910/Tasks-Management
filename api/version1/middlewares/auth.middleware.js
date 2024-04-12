const User = require('../models/user.model')

module.exports.auth = async (req, res, next) => {
  // console.log(req.headers)

  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    const user = await User.findOne({
      tokenUser: token,
      deleted: false,
      status: "active"
    }).select("-password")

    if (!user) {
      res.json({
        msg: "Token không hợp lệ"
      })
      return
    }

    req.user = user
    next()
  }
  else {
    res.json({
      msg: "Vui lòng gửi kèm token"
    })
    return
  }
}