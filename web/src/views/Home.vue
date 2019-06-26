<template>
  <!--主页-->
  <div class="home">
    <Header title="主页" :item-name="sex" @item-change="itemChange" ></Header>
    <div class="swipe-container">
      <van-swipe :autoplay="3000"
                 show-indicators
                 indicator-color="white"
                 loop
                 class="van-swipe"
      >
        <van-swipe-item
          v-for="(pic,i) in swipePic"
          :key="i"
        >
          <van-image
            fit="contain"
            :src="pic.src"
            :alt="pic.alt"
          />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="bar pt-2">
      <navbar></navbar>
    </div>
    <div class="content">
      <div class="module"
           v-for="module in modules"
           :key="module._id"
      >
        <div class="module-header mb-1">
          <div class="module-header-l">
            <h3 class="module-title">{{module.title}}</h3>
            <span class="module-title-desc">{{module.bookType}}</span>
          </div>
          <div class="module-header-r">
            <router-link :to="{ name: 'BookList', params: {id : module._id} }" class="module-header-btn">
              更多
              <svg-icon class="text-lowergrey" icon-class="right-arrow"/>
            </router-link>
          </div>
        </div>
        <home-list :book-info="{id:module._id}" @load-result="loadResult"></home-list>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations} from 'vuex'
  import { HOME_PAGE} from '../utils/storage'
  import api from "../api/api"
  import {loading} from "../utils/toast"
  import Header from '../components/Header'
  import Navbar from "../components/Navbar"
  import HomeList from "./HomeList"


  export default {
    name: 'Home',
    components: {
      Header,
      Navbar,
      HomeList
    },
    data() {
      return {
        sex: 'male',
        swipePic: [
          {src: require('../assets/images/home1.jpg'), alt: ''},
          {src: require('../assets/images/home2.jpg'), alt: ''},
          {src: require('../assets/images/home3.jpg'), alt: ''},
          {src: require('../assets/images/home4.jpg'), alt: ''},
          {src: require('../assets/images/home5.jpg'), alt: ''},
        ],
        barItem: 5,
        modules: [],
        loadModules: []
      }
    },
    watch: {
      loadModules: function () {
        if(this.loadModules.length === 0) {
          loading.closeLoding();
        }
      }
    },
    created() {
      this.SET_HEADER_INFO({
        title: '主页',
        type: HOME_PAGE,
        items: [
          {name: 'male', text: '男生'},
          {name: 'female', text: '女生'},
        ],
      });
      this.fetchData();
      loading.showLoading();
    },
    methods: {
      ...mapMutations([
        'SET_HEADER_INFO'
      ]),
      itemChange(item) {
        loading.showLoading();
        document.body.scrollTop = 0;
        this.sex = item;
        this.fetchData();
      },
      fetchData: function () {
        api.getFeaturedData()
          .then(data => {
            /*
                       * 通过开发工具获取到的接口，无排序和男/女分类，其他地方也没找到相关的接口，
                       * 所以此处只好获取数据之后再进一步处理。此处的数据处理非重点内容。
                       */
            console.log(data);
            data = Array.from(data).sort((a, b) => {
              return a.order - b.order;
            });
            data = data.filter((obj) => {
              return obj.sex == this.sex;
            });
            this.modules = data;
            this.loadModules = Array.from(data, value => value._id);
          });
      },
      loadResult(id) {
        this.loadModules.splice(this.loadModules.indexOf(id), 1);
      }
    },
  }
</script>

<style lang="scss">
  @import "../assets/styles/variable";

  .swipe-container {
    position: relative;
    overflow: hidden;
    height: 7rem;
    height: calc(.314 * (100vw - 1.5rem));
    margin: 0 0.75rem;
  }

  .van-swipe {
    height: 7rem;
    height: calc(.314 * (100vw - 1.5rem));
  }
</style>
