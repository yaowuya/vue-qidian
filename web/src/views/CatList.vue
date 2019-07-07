<template>
  <section class="cat-list">
    <Header :title="title" :isFixed="true"></Header>
    <cat-bar @filter-change="filterBooks" :gender="gender" :major="major"></cat-bar>
    <list-card :book-list="list" v-if="list.length > 0" style="margin-top: 9rem;"></list-card>
    <div class="text-center fs-13 text-gray my-2" v-if="isEnding">没有更多了</div>
  </section>
</template>

<script>
  import Header from "../components/Header"
  import CatBar from "../components/CatBar"
  import ListCard from "../components/ListCard"
  import {mapMutations} from "vuex"
  import api from "../api/api"
  import {debounce} from "../utils/storage"
  import {CATEGORY_PAGE} from "../utils/storage"
  import {loading} from "../utils/toast"

  export default {
    name: "CatList",
    components: {
      Header,
      CatBar,
      ListCard
    },
    data(){
      return{
        title: '',
        list: [],
        page: 0,
        limit: 20,
        gender: '',
        type: 'hot',
        major: '',
        minor: '',
        isEnding: false,
        $docElement: null,
        $body: null,
        clientHeight: 0
      }
    },
    created() {
      this.gender = this.$route.query.gender;
      this.title = this.major = this.$route.params.major;
      this.SET_HEADER_INFO({
        title: this.title,
        type: CATEGORY_PAGE,
        items:[]
      });
      this.fetchData();
    },
    mounted() {
      this.$docElement = document.documentElement;
      this.$body = document.body;
      this.clientHeight = this.$body.clientHeight;
      window.addEventListener('scroll', debounce(this.loadMore));
    },
    methods:{
      ...mapMutations([
        'SET_HEADER_INFO'
      ]),
      fetchData: function() {
        loading.showLoading();
        api.getCatBooks(this.gender, this.type, this.major, this.minor, this.page * this.limit)
          .then(data => {
            console.log("分类数据:",data)
            if (data.length < this.limit) {
              this.isEnding = true;
              loading.closeLoding();
            }
            this.list.push(...data);
          })
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
          this.fetchData();
        }
      },
      filterBooks: function(type, minor) {
        if (this.type === type && this.minor === minor) {
          return;
        } else {
          this.type = type;
          this.minor = minor;
          this.list = [];
          this.page = 0;
          this.fetchData();
        }
      }
    }
  }
</script>

<style scoped>

</style>
