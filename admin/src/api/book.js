import api from "./api"

export default {
  async getBooksByType(bookCategroy){
    let bookData=[];
    for(let param of bookCategroy){
      try {
        await api.getCatBooks(param.gender, param.type, param.major, param.minor, param.start,param.limit)
          .then(data => {
            bookData.push(...data);
          })
      }catch (e) {
         continue;
      }

    }
    return bookData;
  }
}

