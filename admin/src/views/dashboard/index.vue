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
        <el-button type="primary" @click="addChapterSpider">同步章节</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="searchBooks">查询书籍</el-button>
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
        let del=await this.$http.delete("/rest/books/")
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
        let create = await this.$http.post('/spider/chapter', {
          url: 'http://www.biquge.ink/11789_01789/',
          bookId: '5d567464abdf6e604cc2e4a3'
        })
        console.log(create)
      },
      async searchBooks () {
        let books = await this.$http.get('/rest/books')
        console.log(books)
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
