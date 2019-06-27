<template>
  <section class="read">
    <read-content :read-content="readContent" @next-chapter="nextChapter"></read-content>
  </section>
</template>

<script>
  import {mapState, mapMutations} from "vuex"
  import api from "../api/api"
  import ReadContent from "../components/ReadContent";
  import { Dialog } from 'vant';

  export default {
    name: "Read",
    components: {
      ReadContent
    },
    data(){
      return{
        bookId: '',
        chapters: [],
        readContent: [],
        readIndex: 0,
        pageOption: {
          top: '0px',
          bottom: '0px'
        },
      }
    },
    computed:{
      ...mapState([
        'curBook',
        'shelfBookList'
      ])
    },
    watch:{

    },
    created() {
      this.bookId=this.$route.params.id;
      for(let book of Object.values(this.shelfBookList)){
        if (this.bookId === book.id) {
          this.SET_CUR_BOOK(book);
          break;
        }
      }
      this.fetchChapters(this.bookId);
    },
    methods:{
      ...mapMutations([
        'SET_CUR_BOOK',
        'ADD_TO_SHELF'
      ]),
      fetchChapters(bookId) {
        api.getChapters(bookId)
          .then(data => {
            this.chapters = data;
            console.log("章节：",this.chapters);
            // this.fetchChapterContent(this.chapters[0].id)
          })
      },
      fetchChapterContent(chapterId) {
        api.getChapterContent(chapterId)
          .then(data => {
            console.log("内容",data);
            this.readContent.push({
              contentTitle: data.title,
              contentList: data.isVip ? ['vip章节，请到正版网站阅读'] : data.cpContent.split('\n')
            });
            this.$nextTick(function() {

            })
          })
      },
      nextChapter: function() {
        if (this.readIndex === this.chapters.length - 1) {
          return;
        }
        this.readIndex++;
        this.fetchChapterContent(this.chapters[this.readIndex].id);
      },
      selectChapter: function(chapterId) {
        for (let [index, value] of Object.entries(this.chapters)) {
          if (value.id === chapterId) {
            this.readIndex = index;
            break;
          }
        }
        api.getChapterContent(chapterId)
          .then(data => {
            this.readContent.splice(0, this.readContent.length);
            this.readContent.push({
              contentTitle: data.title,
              contentList: data.isVip ? ['vip章节，请到正版网站阅读'] : data.cpContent.split('\n')
            });
            this.$nextTick(function() {
            })
          })
      }
    },
    beforeRouteLeave(to, from, next) {
      if (!this.curBook.isInShelf && !this.isFromMenu) {
        Dialog.confirm({
          title: '温馨提示',
          message: '是否确定从书架中删除'
        }).then(() => {
          // on confirm
          let book = this.curBook;
          book.isInShelf = true;
          this.SET_CUR_BOOK(book);
          this.ADD_TO_SHELF(book);
          next()
        }).catch(() => {
          // on cancel
          next()
        });
      }else{
        next()
      }
    }
  }
</script>

<style scoped>

</style>
