<template>
  <div class="book-list" ref="list">
    <Header :title="title" item-name=""></Header>
    <list-card :book-list="list" v-if="list.length > 0"></list-card>
    <div class="text-center fs-13 text-gray my-2" v-if="isEnding">没有更多了</div>
  </div>
</template>

<script>
  import Header from "../components/Header"
  import {BOOK_PAGE,debounce} from "../utils/storage"
  import api from "../api/api"
  import {loading} from "../utils/toast"
  import {mapState,mapMutations} from "vuex"
  import ListCard from '../components/ListCard'

  export default {
    name: "BookList",
    components:{
      ListCard,
      Header,
    },
    data(){
      return{
        id:"",
        title:"",
        page:1,
        list:[],
        isEnding:false,
        $docElement:null,
        $body:null,
        $list:null,
        clientHeight:0,
      }
    },
    computed:{
      ...mapState([
        'headerTitle',
        'headerType'
      ])
    },
    created() {
      this.SET_HEADER_INFO({
        title:this.headerTitle,
        type: this.headerType,
        items: [],
      });
      if (this.headerType === BOOK_PAGE) {
        this.title = this.headerTitle;
      }
      this.id = this.$route.params.id;
      this.fetchData();
      loading.showLoading();
    },
    mounted: function() {
      this.$docElement = document.documentElement;
      this.$body = document.body;
      this.clientHeight = this.$body.clientHeight;
      this.$list = this.$refs.list;
      window.addEventListener('scroll', debounce(this.loadMore));
    },
    methods:{
      ...mapMutations([
        'SET_HEADER_INFO'
      ]),
      fetchData(){
        if (this.headerType === BOOK_PAGE) {
          console.log('book', 1);
          api.getRecommend(this.id)
            .then(data => {
              this.list = data;
              this.$nextTick(function() {
                this.isEnding = true;
              })
            })
        }else{
          api.getBookList(this.id, this.page)
            .then(data => {
              if (data==undefined||data.length === 0) {
                this.isEnding=true;
                return [];
              }
              this.title = data[0].node.title;
              data = data.map(value => {
                return value.book;
              });
              return data;
            })
            .then(data => {
              if (data.length < 10) {
                this.isEnding = true;
              }
              console.log(data);
              this.list.push(...data);
              this.$nextTick(function() {
                loading.closeLoding();
              })
            })
        }
      },
      loadMore() {
        //可滚动容器的高度
        let innerHeight =this.$body.clientHeight;
        //屏幕尺寸高度
        let outerHeight = this.$docElement.clientHeight;
        //可滚动容器超出当前窗口显示范围的高度
        let scrollTop = this.$docElement.scrollTop;
        //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，
        // 出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
        // console.log(innerHeight + " " + outerHeight + " " + scrollTop);
        if (innerHeight < (outerHeight + scrollTop)) {
          //加载更多操作
          if (this.isEnding === true) {
            return;
          }
          this.page++;
          loading.showLoading();
          this.fetchData();
        }
      }
    }
  }
</script>

<style scoped>

</style>
