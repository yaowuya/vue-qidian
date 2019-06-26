<template>
  <div class="book-detail">
    <Header title="书籍详情" item-name=""></Header>
    <book-info @load-result="loadResult"></book-info>
    <review></review>
    <recommend></recommend>
  </div>
</template>

<script>
  import Header from "../components/Header"
  import {mapState,mapMutations} from "vuex"
  import {BOOK_PAGE} from "../utils/storage"
  import {loading} from "../utils/toast"
  import BookInfo from "../components/BookInfo";
  import Review from "../components/Review";
  import Recommend from "../components/Recommend";

  export default {
    name: "BookDetail",
    components: {
      Recommend,
      Review,
      BookInfo,
      Header
    },
    data(){
      return{
        id:"",
        title:"",
      }
    },
    computed:{
      ...mapState([
        "curBook",
        "shelfBookList"
      ])
    },
    created(){
      loading.showLoading();
      this.SET_HEADER_INFO({
        title: '同类推荐',
        type: BOOK_PAGE,
        items:[]
      });
      this.id=this.$route.params.id||this.curBook.id;
      this.title=this.$route.params.title;
      let isInShelf=false;
      for(let book of Object.values(this.shelfBookList)) {
        if (book.id === this.id) {
          isInShelf = true;
          this.SET_CUR_BOOK(book);
          break;
        }
      }
      if(!isInShelf){
        this.SET_CUR_BOOK({
          id: this.id,	//书籍id
          title: this.$route.params.title,					//书名
          cover: '',					//封面
          author: '',					//作者
          lastChapter: '',			//已更新的最新章节
          updated: '',				//更新时间
          readChapter: '',			//已读章节
          isInShelf: false,			//是否已在书架中，false：不在，true：在
          sort: false					//目录顺序，false：正序， true：倒序
        });
      }
    },
    methods:{
      ...mapMutations([
        "SET_HEADER_INFO",
        "SET_CUR_BOOK"
      ]),
      loadResult(){
        loading.closeLoding();
      }
    }
  }
</script>

<style scoped lang="scss">
  .book-detail {
  }
</style>
