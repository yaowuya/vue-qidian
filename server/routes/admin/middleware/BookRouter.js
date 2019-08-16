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
//查询多级分类
router.post("/pagination", async (req, res) => {
    const {pageNum=1,pageSize=10,name} = req.body;
    const sort={"_id":"asc"};
    const skipNum=(pageNum-1)*pageSize;
    const condition={
        $and:[
            {name:{$regex:name,$options:'i'}}
        ]
    }

    const count=await req.Model.countDocuments(condition);
    const cats=await req.Model.find(condition).populate("parent").skip(skipNum).limit(pageSize).sort(sort);
    res.json({
        count:count,
        data:cats
    });
});

module.exports = router;
