<template>
  <section v-if="book !==null">
    <div class="book-detail book-detail-x">
      <img class="book-cover-blur" :src="cover" :alt="book.title" aria-hidden=“true”>
      <div class="book-detail-info">
        <div class="book-layout">
          <img :src="cover" :alt="book.title" class="book-cover">
          <div class="book-cell">
            <h2 class="book-title">{{book.title}}</h2>
            <div class="book-rand-a text-red">
              {{book.author}}
            </div>
            <div class="book-score">
              <output class="star-group">
                <van-rate
                  v-model="book.rating.score"
                  allow-half
                  void-icon="star"
                  void-color="#eee"
                  :count="Math.ceil(book.rating.score||1)"
                  readonly
                  size="10"
                />
              </output>
              <span class="text-gray">{{book.rating.score}}/{{book.rating.tip}}</span>
              <p class="book-meta">{{ book.majorCate }}/{{ book.minorCate }}</p>
            </div>
            <p class="book-meta">
              {{ wordCount }}字
              <span class="char-pipe">|</span>
              {{ book.isSerial ? '连载中' : '完结'}}
            </p>
          </div>
        </div>
        <div class="book-detail-btn d-flex jc-between">
          <van-button type="danger btn-group-cell" size="small" @click="toRead">免费试读</van-button>
          <van-button @click="addToShelf" type="default btn-group-cell" :disabled="isAdded" size="small">
            {{isAdded?"已在书架":"加入书架"}}
          </van-button>
        </div>

      </div>
    </div>
    <div class="book-summary bg-white" @click="spreadIntro" :class="{enabled:isEnabled}">
      <span class="content fs-13">{{ book.longIntro }}</span>
      <span class="book-summary-more" v-show="isEnabled">
        <svg-icon icon-class="bottom-arrow"/>
      </span>
    </div>
    <div class="book-meta book-status bg-white">
      <router-link :to="{ name: 'Read', params: { id: book._id }, query: { menu: true } }">
        <div class="float-left">
          <strong class="book-spt">目录</strong>
        </div>
        <div class="float-right">
          <p class="ell text-gray">
            {{ book.updated | time }}
            <span class="char-dot">.</span>
            {{ book.lastChapter }}
          </p>
          <svg-icon icon-class="right-arrow"/>
        </div>
      </router-link>
    </div>
    <div class="book-reader bg-white py-1 my-1">
      <ul class="btn-group">
        <li class="btn-group-cell">
          <a href="javascript:" class="book-pay">
            <span class="book-reader-data">{{book.latelyFollower}}</span>
            <h5 class="book-pay-h">追人气</h5>
          </a>
        </li>
        <li class="btn-group-cell">
          <a href="javascript:" class="book-pay">
            <span class="book-reader-data">{{ book.retentionRatio }}%</span>
            <h5 class="book-pay-h">读者留存率</h5>
          </a>
        </li>
        <li class="btn-group-cell">
          <a href="javascript:" class="book-pay">
            <span class="book-reader-data">{{ serializeWordCount }}</span>
            <h5 class="book-pay-h">日更新字数/天</h5>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import api from "../api/api"
  import moment from "moment"
  import {staticPath} from "../utils/storage"

  export default {
    name: "BookInfo",
    data() {
      return {
        book: null,
        isEnabled: true,
        isAdded: false
      }
    },
    filters: {
      time(update) {
        return moment(update).format("YYYY-MM-DD")
      }
    },
    computed: {
      ...mapState([
        'curBook',
        'shelfBookList'
      ]),
      cover() {
        return staticPath + this.book.cover;
      },
      wordCount() {
        return this.book.wordCount > 10000 ? parseInt(this.book.wordCount / 10000) + '万' : this.book.wordCount;
      },
      serializeWordCount() {
        return this.book.serializeWordCount < 0 ? 0 : this.book.serializeWordCount;
      },

    },
    created() {
      this.isAdded = this.curBook.isInShelf;
      api.getBook(this.curBook.id).then(data => {
        this.book = data;
        console.log(this.book);
        let tmpBook = this.curBook;
        tmpBook.title = data.title;
        tmpBook.cover = staticPath + data.cover;
        tmpBook.author = data.author;
        tmpBook.lastChapter = data.lastChapter;
        tmpBook.updated = data.updated;
        console.log("tmpBook",tmpBook);
        this.SET_CUR_BOOK(tmpBook);
        this.$nextTick(function () {
          this.$emit('load-result');
        })

      })
    },
    methods: {
      ...mapMutations([
        'SET_CUR_BOOK',
        'ADD_TO_SHELF'
      ]),
      spreadIntro: function (e) {
        this.isEnabled = !this.isEnabled;
      },
      addToShelf: function() {
        let book = this.curBook;
        book.isInShelf = true;
        this.SET_CUR_BOOK(book);
        this.ADD_TO_SHELF(book);
        this.isAdded = true;
        console.log("click:",book);
      },
      toRead(){
        return this.$router.push({name:"Read",params:{id:this.curBook.id}})
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";

  .book-detail-x {
    position: relative;
    overflow: hidden;
    margin-top: -2.75rem;

    .book-cover {
      width: 5.25rem;
      height: 7rem;
      border-radius: 2Px;
      box-shadow: none;
    }
  }

  .book-cover-blur {
    position: absolute;
    top: -13.2rem;
    top: calc(50% - 87.5vw);
    width: 100%;
    height: 175vw;
    opacity: 0.2;
    opacity: calc(0.1 + 0.05);
    filter: blur(calc(17px + 1px));
  }

  .book-detail-info {
    position: relative;
    padding-top: 2.75rem;
    background: map_get($colors, "white");
    background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0) 8rem) no-repeat center bottom;

    .book-cell {
      line-height: 1.4rem;
    }
  }

  .book-cell {
    overflow: hidden;

    .book-rand-a {
      font-size: .8125rem;
    }

    .book-score {
      font-size: .75rem;

      .star-group {
        margin-right: 0.5rem;
        display: inline-block;
        overflow: hidden;
        height: 1rem;
        width: 5.375rem  /* 86/16 */ ;
        overflow: hidden;
      }
    }

    .book-meta {
      font-size: .75rem;
      overflow: hidden;
    }
  }

  .char-dot, .char-pipe {
    font-family: Georgia, Helvetica, Arial;
    padding: 0 .5ch;
  }

  .book-detail-btn {
    padding: 0 1rem 1rem;

    .btn-group-cell {
      padding: 0.1rem map_get($spacing-sizes,6)*$spacing-base-size !important;
    }
  }

  .btn-group {
    display: table;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    table-layout: fixed;

    .btn-group-cell {
      font-size: 100%;
      font-weight: 400;
      display: table-cell;
    }

    .book-pay {
      position: relative;
      display: block;
      padding: .75rem 0 .5rem;
      text-align: center;
    }

    .book-reader-data {
      font-size: 1rem;
      margin-bottom: .125rem;
      color: #ed424b;
    }

    .book-pay-h {
      font-size: .75rem;
      font-weight: 400;
      line-height: 1.25em;
      position: relative;
      top: .125rem;
    }
  }

  .book-summary {
    font-size: .875rem;
    line-height: 1.5rem;
    position: relative;
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: justify;
    border-top: 1rem solid transparent;
    border-bottom: 1rem solid transparent;
    box-shadow: 0 1px #f0f1f2, 0 -1px #f0f1f2;

    &.enabled {
      height: 6.6rem;
      max-height: none;
      overflow: hidden;

      .book-summary-more {
        visibility: visible;
      }
    }

    .book-summary-more {
      position: absolute;
      right: 1rem;
      bottom: 0;
      visibility: hidden;
      width: 2rem;
      height: 1.5rem;
      text-align: right;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff 1rem);
    }
  }

  .book-status {
    line-height: 2.75rem;
    display: block;
    padding: 0 1rem;

    .float-right {
      position: relative;
      max-width: 80%;
      max-width: calc(100% - (80rem / 16));
      padding-right: .75rem;
      svg{
        position: absolute;
        top: 1rem;
        right: 0;
        color: #969ba3;
      }
    }
  }

  .book-spt {
    font-size: 1rem;
    vertical-align: top;
  }

  .ell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }


</style>
