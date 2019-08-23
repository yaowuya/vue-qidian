<template>
  <section class="dashboard">
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <div class="dashboard-container">
          <div class="dashboard-text">name: {{ name }}</div>
        </div>
      </el-col>
    </el-row>
    <h2>book-spider</h2>
    <el-row type="flex" justify="start">
      <el-col :span="3">
        <el-button type="primary" @click="addCatSpider">同步分类</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="addBookSpider">同步书籍</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="addChapterSpider">同步章节测试</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="searchBooks">查询书籍</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="addChapter">同步章节内容</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="chapterTest">章节测试</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '../../api/api'
  import book from '../../api/book'

  export default {
    name: 'Dashboard',
    data () {
      return {}
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    methods: {
      async addCatSpider () {
        let create = await this.$http.post('/spider/category', { url: 'http://www.biquge.ink' })
        console.log(create)
      },
      async addBookSpider () {
        let del = await this.$http.delete('/rest/books/')
        let category = await this.$http.get('/rest/categories')
        for (let cate of category) {
          let create = await this.$http.post('/spider/book',
            {
              url: cate.url,
              type: cate.name,
              cate: cate._id
            })
          console.log(create)
        }
      },
      async addChapterSpider () {
        let create = await this.$http.post('/spider/testChapter', {
          url: 'http://www.biquge.ink/22081_02081/',
          bookId: '5d567461abdf6e604cc2e46d'
        })
        console.log(create)
      },
      async searchBooks () {
        let books = this.$http.get('/rest/book')
        books.then(data => {
          console.log(data)
        }).catch(err => {
          console.log(err)
        })

        // for (let book of books) {
        //   console.log(book.url, book._id)
        // }
      },
      async addChapter () {
        let books = await this.$http.get('/rest/book')
        for (let book of books) {
          this.chapterByTime(book)
        }
      },
      chapterByTime (book) {
        setTimeout(async () => {
          let create = await this.$http.post('/spider/chapter')
          console.log(create)
        }, 1000)
      },
      async chapterTest(){
        let chapters=await this.$http.post('/spider/chapter/content')
        console.log(chapters)
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
