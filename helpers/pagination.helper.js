module.exports = (query, count) => {
  objectPagination = {
    limit: 2,
    currentPage: 1,
    skipItem: 0
  }

  if (query.index) {
    objectPagination.currentPage = query.index
  }

  if (query.limit) {
    objectPagination.limit = query.limit
  }

  objectPagination.skipItem = (parseInt(objectPagination.currentPage) - 1) * objectPagination.limit
  objectPagination.totalPages = Math.ceil(count / objectPagination.limit)

  return objectPagination
}