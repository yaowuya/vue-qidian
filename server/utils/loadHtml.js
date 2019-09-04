const superAgent=require("superagent");
const charset=require("superagent-charset");
charset(superAgent);

async function fetchByUrl (url) {
  let res=await superAgent("GET",url).buffer(true).charset("gbk");
  return res.text;
}

module.exports={
  fetchByUrl,
}
