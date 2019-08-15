const express = require('express')
const router = express.Router({
  mergeParams: true
})

// 创建资源
router.post('/', async (req, res) => {
  const model = await req.Model.create(req.body)
  res.send(model)
})
// 批量插入
router.post('/insertMany', async (req, res) => {
  const model = await req.Model.insertMany(req.body)
  res.send(model)
})
// 更新资源
router.put('/:id', async (req, res) => {
  const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
  res.send(model)
})
//删除资源
router.delete('/:id', async (req, res) => {
  const del = await req.Model.findByIdAndDelete(req.params.id)
  res.send({
    success: true,
    data: del
  })
})
//清空表
router.delete('/', async (req, res) => {
  const del = await req.Model.deleteMany({})
  res.send({
    success: true,
    data: del
  })
})

//资源列表
router.get('/', async (req, res) => {
  //因为parent是一个id，关联了req.Model
  const items = await req.Model.find()
  res.send(items)
})

//资源详情
router.get('/:id', async (req, res) => {
  const items = await req.Model.findById(req.params.id)
  res.send(items)
})

module.exports = router
