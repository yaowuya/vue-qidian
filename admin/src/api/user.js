import http from "../http"

export const getInfo= async (username)=>{
  const res=await http.get(`/user/users/findByName/${username}`);
  return res;
}

