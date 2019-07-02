<template>
  <section class="search bg-white">
    <header class="header">
      <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        show-action
        clearable
        @search="onSearch"
        @cancel="onCancel"
      />
    </header>
    <list-card :book-list="searchBooks" v-if="searchBooks.length > 0"></list-card>
    <div v-else class="search-hot-history">
      <div class="search-popular">
        <div class="search-title-bar">
          <h5 class="search-title">大家都在搜</h5>
        </div>
        <div class="search-tags">
          <router-link
            class="btn-line-gray"
            :to="{}"
            v-for="(hot,i) in hotKeywords"
            :key="i"
          >
             {{hot.word}}
          </router-link>
        </div>
      </div>
      <div>
        <div class="search-title-bar">
          <h5 class="search-title">搜索历史</h5>
          <div class="search-operate">
            <a href="javascript:" class="search-operate-a" @click="clearAll">
              <svg-icon icon-class="delete"></svg-icon>
              清空
            </a>

          </div>
        </div>
        <div class="search-tags">
          <router-link
            class="btn-line-gray"
            :to="{}"
            v-for="(history,i) in searchHistory"
            :key="i"
          >
            {{ history }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import api from "../api/api"
  import ListCard from "../components/ListCard";


  export default {
    name: "Search",
    components: {ListCard},
    data() {
      return {
        searchValue: "",
        hotKeywords: [],
        searchBooks: []
      }
    },
    computed: {
      ...mapState([
        'searchHistory'
      ])
    },
    created() {
      api.getSearchHotKeywords()
        .then(data => {
          console.log("热门关键字：",data);
          this.hotKeywords = data.slice(0, 19);
        })
    },
    methods: {
      ...mapMutations([
        'SET_SEARCH_HISTORY',
        'CLEAR_SEARCH_HISTORY'
      ]),
      onSearch(key) {
        let keyword =key;
        if (key!=null&&key!=undefined&&key!=""){
          this.SET_SEARCH_HISTORY(keyword);
        }
        api.searchByKeyword(keyword)
          .then(data => {
            this.searchBooks = data;
          })
      },
      onCancel() {
        this.$router.go(-1)
      },
      clearAll: function () {
        this.CLEAR_SEARCH_HISTORY();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";

  .header {
    position: relative;
    height: 2.75rem;
  }

  .search-popular{
    overflow: hidden;
    transition: height 200ms ease 0s;
    height: 15rem;
  }
  .search-title-bar {
    line-height: 1.8125rem;
    overflow: hidden;
    padding: .9375rem 1rem 0;
    background-color: rgba(0,0,0,.03);
    .search-title {
      font-size: 13px;
      font-weight: 400;
      float: left;
      color: #969ba3;
    }
    .search-operate {
      font-size: 13px;
      float: right;
    }
  }
  .search-operate-a {
    display: inline-block;
    margin: 0 -.5rem;
    padding: 0 .5rem;
  }
  .btn-line-gray{
    font-size: .8125rem;
    line-height: 1.6875rem;
    display: inline-block;
    padding: 0 .625rem;
    text-align: center;
    border: 1px solid;
    border-radius: 99px;
    color: #969ba3;
    margin: .5rem .5rem 0 0;
  }

  .search-tags {
    padding: .25rem .5rem .75rem 1rem;
  }
</style>
