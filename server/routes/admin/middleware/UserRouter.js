const express=require("express")
const router = express.Router({
    mergeParams: true
});
// 创建资源
router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
});

router.get("/findByName/:username", async (req, res) => {
    console.log("req:",req);
    const user = await req.Model.findOne({username:req.params.username});
    res.json(user);
});

module.exports=router;
