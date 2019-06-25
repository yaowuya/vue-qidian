<template>
  <ol class="book-ol book-ol-normal">
    <li class="book-li" v-for="book in bookList" :key="book._id">
      <router-link :to="{/*name:'book',params:{id:book._id}*/}" class="book-layout">
        <img :src="book.cover" alt="" class="book-cover">
        <div class="book-cell">
          <h4 class="book-title">
            {{book.title}}
          </h4>
          <p class="book-desc">
            {{ book.shortIntro }}
          </p>
          <div class="book-meta">
            <div class="book-meta-l">
              <span class="book-author" role="option">
                <svg-icon class="text-lowergrey" icon-class="seeusero"/>
                {{ book.author }}
              </span>
            </div>
            <div class="book-meta-r">
              <span class="tag-small-group origin-right">
                <em class="tag-small text-gray">
                  {{ book.majorCate }}
                </em>
                <em class="tag-small text-red">
                  {{ book.isSerial ? '连载中' : '完结' }}
                </em>
                <em class="tag-small text-blue">
                  {{book.latelyFollower+'人气'}}
                </em>
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </li>
  </ol>
</template>

<script>
  import api from "../api/api"
  export default {
    name: "BookList",
    props:{
      bookInfo:{type:Object,required:true}
    },
    data(){
      return {
        bookList:[]
      }
    },
    watch:{
      "bookInfo":"fetchData"
    },
    created: function() {
      this.fetchData();
    },
    methods: {
      fetchData: function() {
        api.getBooks(this.bookInfo.id)
          .then(data => {
            data = data.map(value => {
              return value.book;
            });
            return data;
          })
          .then(data => {
            this.bookList = data;
            this.$nextTick(function () {
              this.$emit('load-result', this.bookInfo.id);
            })
          })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";

  .book-ol {
    &::before{
      display: block;
      clear: both;
      height: 0;
      content: '';
      visibility: hidden;
    }
    .book-li{
      ::after {
        display: block;
        margin-top: -1Px;
        margin-left: 1rem;
        content: '';
        transition: margin-left 0.15s;
        border-bottom: 1Px solid #f0f1f2;
      }
      :last-child::after {
        display: none
      }
    }

    .book-layout {
      position: relative;
      display: block;
      overflow: hidden;
      padding: 0.6rem;
      transition: padding-left 0.15s;
    }

    .book-cover {
      font-size: 0;
      float: left;
      width: 4.125rem;
      height: 5.5rem;
      margin-right: .5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    }

    .book-cell {
      overflow: hidden;
    }

    .book-title {
      line-height: 1.4;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 1rem;
    }

    .book-desc {
      font-size: 0.875rem /* 14/16 */;
      line-height: 1.125rem;
      overflow: hidden;
      margin: 0.5rem 0;
      color: #969ba3
    }

    .book-meta {
      font-size: 0.75rem;
      overflow: hidden;
    }

    .book-meta-l {
      float: left;
    }

    .book-author {
      font-size: 0.8125rem;
      display: block;
      overflow: hidden;
      max-width: 10em;
      max-width: calc(100vw - 2rem - (176rem / 16));
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #969ba3;
    }

    .book-meta-r {
      position: relative;
      float: right;
      position: relative;

      .tag-small-group {
        position: absolute;
        top: -0.375rem;
        right: 0;
        white-space: nowrap;
      }
    }

    .tag-small-group {
      display: inline-block;
      transform: scale(.5);

      .tag-small:first-child {
        margin-left: 0;
      }
    }

    .origin-right {
      transform-origin: right center;
    }

    .tag-small {
      font-size: 1.25rem;
      line-height: 1.3;
      display: inline-block;
      margin: 0 .15em;
      padding: 0 .25em;
      transform: scale(1);
      vertical-align: bottom;
      &::before {
        position: absolute;
        z-index: -1;
        top: -1px;
        right: 0;
        bottom: 1px;
        left: 0;
        content: '';
        opacity: 0.5;
        border: 1px solid;
        border-radius: .11111em;
      }
    }
  }

  .book-ol-normal {
    .book-desc {
      line-height: 1.1875rem;
      display: -webkit-box;
      height: 2.25rem;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2
    }
  }

</style>
