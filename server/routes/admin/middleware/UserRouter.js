const express=require("express")
const router = express.Router({
    mergeParams: true
});

router.get("/findByName/:username", async (req, res) => {
    console.log("req:",req);
    const user = await req.Model.findOne({username:req.params.username});
    res.json(user);
});

module.exports=router;
