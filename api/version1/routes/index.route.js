const taskRoute = require('./task.route')
const userRoute = require('./user.route')

const authMiddleware = require('../middlewares/auth.middleware')

module.exports = function (app) {
  const ver1 = '/api/ver1'

  app.use(ver1 + "/task", authMiddleware.auth, taskRoute)

  app.use(ver1 + "/user", userRoute)
}