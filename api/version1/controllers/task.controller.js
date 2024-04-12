const Task = require('../models/task.model')

const paginationHelper = require('../../../helpers/pagination.helper')
const searchHelper = require('../../../helpers/search.helper')

// [GET] /task
module.exports.index = async (req, res) => {

  const find = {
    $or: [
      {createdBy: req.user.id},
      {listUser: req.user.id} 
    ],
    deleted: false
  }

  //Status
  if (req.query.status) {
    find.status = req.query.status
  }

  //Sort
  const sort = {}
  if (req.query.sortValue && req.query.sortKey) {
    sort[req.query.sortKey] = req.query.sortValue
  }
  else {
    sort.title = 'asc'
  }

  //Pagination
  const count = await Task.countDocuments(find)
  const objectPagination = paginationHelper(req.query, count)

  //Search
  const searchObject = searchHelper(req.query)
  if (searchObject.regex) {
    find.title = searchObject.regex
  }

  const tasks = await Task
    .find(find)
    .sort(sort)
    .limit(objectPagination.limit)
    .skip(objectPagination.skipItem)

  res.json(tasks)
}

// [GET] /task/detail/:id
module.exports.detail = async (req, res) => {
  const singleTask = await Task.find({
    _id: req.params.id,
    deleted: false
  })
  res.json(singleTask)
}

// [PATCH] /task/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id
    const status = req.body.status
    await Task.updateOne(
      {
        _id: id
      },
      {
        status: status
      }
    )
    res.json({
      id: id,
      msg: "Đổi trạng thái thành công"
    })
  }
  catch (error) {
    res.json({
      msg: "Đổi trạng thái thất bại"
    })
  }
}

// [GET] /task/change-multi
module.exports.changeMulti = async (req, res) => {
  const { ids, key, value } = req.body
  console.log(ids)
  console.log(key)
  console.log(value)
  switch (key) {
    case "status":
      await Task.updateMany(
        {
          _id: { $in: ids }
        },
        {
          status: value
        }
      )
      res.json({
        msg: "Đổi trạng thái thành công"
      })
      break
    case "delete":
      await Task.updateMany(
        {
          _id: { $in: ids }
        },
        {
          deleted: true,
          deletedAt: new Date()
        }
      )
      res.json({
        msg: "Xóa tài khoản thành công"
      })
      break
    default:
      res.json({
        msg: "Thất bại"
      })
  }
}

// [POST] /task/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id
    const task = new Task(req.body)
    await task.save()
    res.json({
      msg: "Tạo thành công",
      newTask: task
    })
  }
  catch (error) {
    res.json({
      msg: "Tạo thất bại"
    })
  }
}

// [PATCH] /task/edit/:id
module.exports.edit = async (req, res) => {
  try {
    await Task.updateOne({ _id: req.params.id }, req.body)
    res.json({
      msg: "Cập nhật thành công"
    })
  }
  catch (error) {
    res.json({
      msg: "Cập nhật thất bại"
    })
  }
}

// [DELETE] /task/delete/:id
module.exports.delete = async (req, res) => {
  try {
    // await Task.deleteOne({_id: req.params.id})
    await Task.updateOne({ _id: req.params.id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    )
    res.json({
      msg: "Xóa thành công"
    })
  }
  catch (error) {
    res.json({
      msg: "Xóa thất bại"
    })
  }
}