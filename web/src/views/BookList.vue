<template>
  <div class="book-list">
    <Header item-name=""></Header>
  </div>
</template>

<script>
  import Header from "../components/Header"
  import {BOOK_PAGE,debounce} from "../utils/storage"
  import api from "../api/api"
  import {mapState,mapMutations} from "vuex"

  export default {
    name: "BookList",
    components:{
      Header
    },
    data(){
      return{
        id:"",
        title:""
      }
    },
    computed:{
      ...mapState([
        'headerTitle',
        'headerType'
      ])
    },
    created() {
      if (this.headerType === BOOK_PAGE) {
        this.title = this.headerTitle;
      }
      this.id = this.$route.params.id;
      this.title=this.$route.params.title;
      this.SET_HEADER_INFO({
        title: this.title,
        type: BOOK_PAGE,
        items: [],
      });
    },
    methods:{
      ...mapMutations([
        'SET_HEADER_INFO'
      ])
    }
  }
</script>

<style scoped>

</style>
