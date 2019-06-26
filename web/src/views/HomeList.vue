<template>
  <list-card :book-list="bookList"></list-card>
</template>

<script>
  import ListCard from "../components/ListCard"
  import api from '../api/api'

  export default {
    name: 'HomeList',
    props: {
      bookInfo: { type: Object, required: true }
    },
    components:{
      ListCard
    },
    data () {
      return {
        bookList: []
      }
    },
    watch: {
      'bookInfo': 'fetchData'
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        api.getBooks(this.bookInfo.id)
          .then(data => {
            data = data.map(value => {
              return value.book
            })
            return data
          })
          .then(data => {
            this.bookList = data
            this.$nextTick(function () {
              this.$emit('load-result', this.bookInfo.id)
            })
          })
      }
    },
  }
</script>

<style scoped lang="scss">

</style>
