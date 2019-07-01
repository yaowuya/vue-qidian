<template>
  <section class="read">
    <read-content :read-content="readContent" @next-chapter="nextChapter" @show-menu="showMenu" @next-chapt="nextChapt"></read-content>
    <chapter :chapters="chapters"
             :show="isShowChapters"
             :chapterWidth="chapterWidth"
             :isFromMenu="isFromMenu"
             @hide-menu="hideMenu"
             @select-chapter='selectChapter'
             v-if="chapters.length > 0">

    </chapter>
  </section>
</template>

<script>
  import {mapState, mapMutations} from "vuex"
  import api from "../api/api"
  import ReadContent from "../components/ReadContent";
  import {Dialog} from 'vant';
  import Chapter from "../components/Chapter";

  export default {
    name: "Read",
    components: {
      Chapter,
      ReadContent
    },
    data() {
      return {
        bookId: '',
        chapters: [],
        readContent: [],
        readIndex: 0,
        pageOption: {
          top: '0px',
          bottom: '0px'
        },
        isShowChapters: false,
        isFromMenu: false,
        chapterWidth:"80%"
      }
    },
    computed: {
      ...mapState([
        'curBook',
        'shelfBookList'
      ])
    },
    watch: {
      chapters: function () {
        if (this.curBook.readChapter !== '') {
          // 去书架中取书籍的历史阅读记录
          for (let [idx, chapter] of Object.entries(this.chapters)) {
            if (this.curBook.readChapter === chapter.id) {
              this.readIndex = idx;
              break;
            }
          }
        }
        this.fetchChapterContent(this.chapters[this.readIndex].id);
      },
      readIndex: function () {
        let book = this.curBook;
        book.readChapter = this.chapters[this.readIndex].id;
        this.SET_CUR_BOOK(book);
      }
    },
    created() {
      this.bookId = this.$route.params.id;
      for (let book of Object.values(this.shelfBookList)) {
        if (this.bookId === book.id) {
          this.SET_CUR_BOOK(book);
          break;
        }
      }
      this.fetchChapters(this.bookId);
      if(this.$route.query.menu) {
        this.isFromMenu = true;
        this.isShowChapters = true;
        this.chapterWidth="100%";
      }
    },
    methods: {
      ...mapMutations([
        'SET_CUR_BOOK',
        'ADD_TO_SHELF'
      ]),
      fetchChapters(bookId) {
        api.getChapters(bookId)
          .then(data => {
            this.chapters = data;
            console.log("章节：", this.chapters);
            // this.fetchChapterContent(this.chapters[0].id)
          })
      },
      fetchChapterContent(chapterId) {
        api.getChapterContent(chapterId)
          .then(data => {
            console.log("内容", data);
            this.readContent.push({
              id:data.id,
              contentTitle: data.title,
              contentList: data.isVip ? ['vip章节，请到正版网站阅读'] : data.cpContent.split('\n')
            });
            this.$nextTick(function () {

            })
          })
      },
      nextChapter: function () {
        if (this.readIndex === this.chapters.length - 1) {
          return;
        }
        this.readIndex++;
        this.fetchChapterContent(this.chapters[this.readIndex].id);
      },
      selectChapter: function (chapterId) {
        if(this.isFromMenu) {
          this.isFromMenu = false;
        }
        this.isShowChapters = false;
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
            this.$nextTick(function () {
            })
          })
      },
      showMenu: function () {
        this.isShowChapters = true;
      },
      hideMenu: function() {
        console.log("isFromMenu",this.isFromMenu);
        if(this.isFromMenu) {
          this.$router.go(-1);
        }
        this.isShowChapters = false;
      },
      nextChapt:function () {
        if (this.readIndex === this.chapters.length - 1) {
          return;
        }
        this.readIndex++;
        this.fetchChapterContent(this.chapters[this.readIndex].id);
      },
    },
    beforeRouteLeave(to, from, next) {
      if (!this.curBook.isInShelf && !this.isFromMenu) {
        Dialog.confirm({
          title: '温馨提示',
          message: '喜欢本书就加入书架吧'
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
      } else {
        next()
      }
    }
  }
</script>

<style scoped>

</style>
