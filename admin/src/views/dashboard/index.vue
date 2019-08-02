<template>
  <section class="dashboard">
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <div class="dashboard-container">
          <div class="dashboard-text">name: {{ name }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start">
      <el-col :span="3">
        <el-button type="primary" @click="addCate">同步一级分类</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="addMins">同步二级分类</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="success" @click="addBook">添加书籍</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="success" @click="addChapter">获取章节</el-button>
      </el-col>
    </el-row>
    <h2>book-spider</h2>
    <el-row type="flex" justify="start">
      <el-col :span="3">
        <el-button type="primary" @click="addBookSpider">同步书籍</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import api from "../../api/api"
import book from "../../api/book"

export default {
  name: 'Dashboard',
  data(){
    return{
      typeList: [{
        value: 'hot',
        name: '热门'
      }, {
        value: 'new',
        name: '新书'
      }, {
        value: 'reputation',
        name: '好评'
      }, {
        value: 'over',
        name: '完结'
      }, {
        value: 'monthly',
        name: '包月'
      }],
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods:{
    async addCate(){
      let del=await this.$http.delete("/rest/categories");
      console.log("delete",del);
      for(let type of this.typeList){
        let create=await this.$http.post("/rest/categories",{
          name:type.value,
          parent:null,
          level:"普通分类",
          bookCount:0,
        });
      }
      api.getCategory()
        .then(async data => {
          console.log("分类",data);
          for (let [key, value] of Object.entries(data)) {
            let create=await this.$http.post("/rest/categories",{
              name:key,
              parent:null,
              level:"一级分类",
              bookCount:0,
            });
            let cat=[];
            for(let category of Object.values(value)){
              cat.push({
                name:category["name"],
                parent:create._id,
                level:"二级分类",
                bookCount:category["bookCount"],
              })
            }

            if(cat.length>0){
              let insertMany=await this.$http.post("/rest/categories/insertMany",cat);
              console.log("insertMany",insertMany);
            }

          }
        })
    },
    async addMins(){
      const cats=await this.$http.get("/rest/categories");
      api.getMinorList()
        .then(async data => {
          let result=[];
          for (let gender of ["female","male","picture","press"]){
            for (let [index, elem] of Object.entries(data[gender])) {
              for(let [key,val] of Object.entries(cats)){
                if(elem.major===val.name){
                  if(elem.mins.length>0){
                    for(let mins of elem.mins){
                      result.push({
                        name:mins,
                        parent:val._id,
                        level:"三级分类",
                        bookCount:0,
                      })
                    }
                  }
                }
              }
            }
          }
          if(result.length>0){
            let insertMany=await this.$http.post("/rest/categories/insertMany",result);
            console.log("insertMany",insertMany);
          }
        })
    },
    async addBook(){
      const commonLevel=await this.$http.post("/book/categories/multiLevel",{level:"普通分类"});
      const firstLevel=await this.$http.post("/book/categories/multiLevel",{level:"一级分类"});
      let bookCat=[];
      for(let common of commonLevel){
        for(let first of firstLevel){
          for(let second of first.children){
            for(let third of second.children){
              bookCat.push({
                gender:first.name,
                type:common.name,
                major:second.name,
                minor:third.name,
                start:0,
                limit:20000
              })
            }
          }
        }
      }
      console.log("分类：",bookCat);
      const bookData=await book.getBooksByType(bookCat);
      console.log(bookData);
      for(let value of bookData){
        await this.$http.post("/rest/books/",{
          bookId:value._id,
          title:value.title,
          cover:value.cover,
          author:value.author,
          categories: [],
          lastChapter:value.lastChapter,
          readChapter:"",
          isInShelf:false,
          sort:false,
          majorCate:value.majorCate,
          minorCate:value.minorCate,
          latelyFollower:value.latelyFollower,
          isSerial:false,
          retentionRatio:value.retentionRatio,
          shortIntro:value.shortIntro,
          longIntro:"",
          ratingCount:0,
          ratingScore:0,
          wordCount:0,
          serializeWordCount:0,
          updated:"",
        });
      }
    },
    async addChapter(){
      api.getChapters("58310e4ee6065f1e50865328")
        .then(data => {
          this.chapters = data;
          console.log("章节：", this.chapters);
          // this.fetchChapterContent(this.chapters[0].id)
        })
    },
    async addBookSpider(){
      let create=await this.$http.post("/spider/book",{url:"http://www.biquge.ink/"});
      console.log(create);
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
