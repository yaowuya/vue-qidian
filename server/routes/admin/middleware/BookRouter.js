const express = require("express")
const router = express.Router({
    mergeParams: true
});
// 创建资源
router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
});
//查询多级分类
router.post("/multiLevel", async (req, res) => {
    const {level} = req.body
    const cats = await req.Model.find().where("level").equals(level).populate({
        path: "children",
        populate: {
            path: "children"
        }
    }).lean();
    res.json(cats);
});

module.exports = router;
