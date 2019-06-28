<template>
  <section class="read-content" :class="[skinColor,{'read-night':nightMode}]">
    <div class="page-rss" @click="showOpt"></div>
    <div class="page-read-opt" :class="[{active:isShowOpt}]">
      <!--头部-->
      <header class="header read-opt-header">
        <p class="header-back">
          <svg-icon class="fs-16" icon-class="left-arrow" @click="$router.go(-1)"></svg-icon>
        </p>
      </header>
      <!--加入书架按钮-->
      <button class="read-join-sj" v-show="!isAdded" @click="addToShelf">加入书架</button>
      <!--肤色等设置-->
      <div class="read-opt-bot read-opt-set" :class="[{ active:isShowSet}]">
        <!--肤色设置-->
        <div class="read-set-skin">
          <ul class="btn-group">
            <li
              class="btn-group-cell read-set-cell"
              v-for="(skin,index) in skinBgList"
              :key="index"
            >
              <input :id="skin+index" type="radio" @click="changeBkColor(skin)">
              <label :for="skin+index" :class="['read-'+skin,{skinActive:skin===skinColor}]"
                     class="skin-label d-flex jc-center ai-center">
                <svg-icon icon-class="red-ok"></svg-icon>
              </label>
            </li>
          </ul>
        </div>
        <!--      布局设置-->
        <div class="read-set-layout">
          <ul class="btn-group">
            <li class="btn-group-cell read-set-cell">
              <input id="radio-a-" type="radio" @click="changeFontSize(false)">
              <label for="radio-a-" class="read-btn-layout d-flex jc-center ai-center"
                     :class="{ nochange: fontSize <= 10 }">
                <svg-icon icon-class="white-A-"></svg-icon>
              </label>
            </li>
            <li class="btn-group-cell read-set-cell">
              <input id="radio-a+" type="radio" @click="changeFontSize(true)">
              <label for="radio-a+" class="read-btn-layout d-flex jc-center ai-center"
                     :class="{ nochange: fontSize >= 24 }">
                <svg-icon icon-class="white-a+"></svg-icon>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <!--      底部-->
      <footer class="read-opt-footer">
        <div class="btn-group">
          <van-tabbar v-model="tabActive" inactive-color="#8c8b8a" active-color="#fefefe">
            <van-tabbar-item @click="showMenu">
              <span>目录</span>
              <svg-icon slot="icon" icon-class="white-catalog"></svg-icon>
            </van-tabbar-item>
            <van-tabbar-item @click="showOptSet">
              <span>设置</span>
              <svg-icon slot="icon" icon-class="white-Aa"></svg-icon>
            </van-tabbar-item>
            <van-tabbar-item @click="switchMode">
              <span v-if="nightMode">夜间</span>
              <span v-else>日间</span>
              <svg-icon slot="icon" icon-class="white-night"></svg-icon>
            </van-tabbar-item>
          </van-tabbar>
        </div>
      </footer>
    </div>
    <div class="page-read">
      <div class="page-read-content" v-if="readContent.length > 0">
        <article
          class="read-article"
          :style="{ fontSize: fontSize + 'px' }"
          v-for="(rc,index) in readContent"
          :key="index"
        >
          <section class="read-section">
            <h3 class="title">{{rc.contentTitle}}</h3>
            <p v-for="(content,i) in rc.contentList"
               :key="i">
              {{content}}
            </p>
          </section>
        </article>
        <div class="read-load-next">
          <button class="btn-normal"  @click="$emit('next-chapt')">加载下一章</button>
        </div>
      </div>
    </div>
    <div class="page-read-top">
      <h1 class="read-book-name">{{ curBook.title }}</h1>
    </div>
  </section>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'ReadContent',
    props: {
      readContent: Array
    },
    watch: {
      //当为点击目录进入阅读界面时，滚动条回到顶部
      readContent: function () {
        if (this.readContent.length === 1) {
          document.body.scrollTop = 0
        }
      }
    },
    computed: {
      ...mapState([
        'curBook',
        'nightMode',
        'skinColor',
        'fontSize'
      ])
    },
    data() {
      return {
        tabActive: 7,
        isAdded: false,
        isShowOpt: false,
        isShowSet: false,
        skinBgList: ['skin-default', 'skin-blue', 'skin-green', 'skin-light']
      }
    },
    created() {
      this.isAdded = this.curBook.isInShelf;
      console.log("curBook:", this.curBook);
      if (!this.skinBgList.includes(this.skinColor)) {
        this.SET_SKIN_COLOR('skin-default')
      }
    },
    methods: {
      ...mapMutations([
        'SET_NIGHT_MODE',
        'SET_SKIN_COLOR',
        'SET_FONT_SIZE',
        'SET_CUR_BOOK',
        'ADD_TO_SHELF'
      ]),
      showOpt() {
        if (this.isShowOpt || this.isShowSet) {
          this.isShowOpt = this.isShowSet = false;
        } else {
          this.isShowOpt = true;
        }
      },
      showOptSet() {
        this.isShowSet = true;
      },
      switchMode: function () {
        this.isShowSet = false;
        this.SET_NIGHT_MODE(!this.nightMode);
      },
      changeFontSize(isAdd) {
        if ((this.fontSize >= 30 && isAdd) || (this.fontSize <= 10 && !isAdd)) {
          return;
        }
        let size = this.fontSize;
        isAdd ? size++ : size--
        this.SET_FONT_SIZE(size);
      },
      changeBkColor(skin) {
        this.SET_NIGHT_MODE(false);
        this.SET_SKIN_COLOR(skin);
      },
      showMenu: function () {
        this.isShowOpt = this.isShowSet = false;
        this.$emit('show-menu');
      },
      addToShelf: function() {
        if (this.isAdded) {
          return;
        }
        let book = this.curBook;
        book.isInShelf = true;
        this.SET_CUR_BOOK(book);
        this.ADD_TO_SHELF(book);
        this.isAdded = true;
      }
    }
  }
</script>

<style scoped lang="scss">
  .read-content {
    position: relative;
    min-height: 100%;
    min-height: 100vh;
    overflow: hidden;
  }

  .page-read {
    position: relative;
    color: rgba(0, 0, 0, .85);

    &:not(.H) {
      padding-top: 2rem;
    }
  }

  .page-read-content {
    border-top: 0 solid transparent;

    .read-article {
      font-size: 1.125rem;
    }
  }

  .read-article {
    font-size: 1rem;
    line-height: 1.8;
    overflow: hidden;
    min-height: calc(100vh - 44px);
    margin: 0 16px;
    text-align: justify;

    h3 {
      font-size: 1.5em;
      font-weight: 600;
      line-height: 1.2;
      margin: 1em 0;
    }

    p {
      font-size: 1em;
      margin: 0.5em 0;
      text-indent: 2em;
      letter-spacing: 0.0625rem /* 1/16 */
    ;
      line-height: 1.8;
      font-family: sans-serif;
    }
  }

  .read-section {
    overflow: hidden;
    min-height: inherit;
  }

  .read-load-next {
    font-size: .75rem;
    position: relative;
    right: 0;
    left: 0;
    overflow: hidden;
    height: 58px;
    transition: height .25s, border-bottom-width .25s;
    text-align: center;
    color: rgba(0, 0, 0, .4);

    .btn-normal {
      font-size: 0.875rem;
      color: white;
      background: red;
      border: none;
      border-radius: 99rem;
      padding: 0.4rem 7rem;
      margin-top: 1rem;
    }
  }

  .page-read-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 2rem;
    background: inherit;
  }

  .read-book-name {
    font-size: .75rem;
    font-weight: 400;
    position: absolute;
    top: 15px;
    left: 1rem;
    color: rgba(0, 0, 0, .4);
  }

  .page-read-opt {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    visibility: hidden;
    -webkit-transition: opacity .15s, visibility .15s;
    transition: opacity .15s, visibility .15s;
    opacity: 0;
  }

  .header {
    position: relative;
    box-sizing: border-box;
    height: 2rem;
    padding-top: .6875rem;
    padding-bottom: .625rem;
    border-bottom: 1px solid #f0f1f2;
    background-color: #fff;

    .header-back {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      padding: .625rem .8125rem .625rem .875rem;
    }
  }

  .read-opt-bot, .read-opt-footer, .read-opt-header, .read-opt-more {
    -webkit-transition: opacity .15s, -webkit-transform .15s, visibility .15s;
    transition: opacity .15s, transform .15s, visibility .15s;
    color: #fff;
    border-bottom: 0;
    background-color: rgba(0, 0, 0, .9);
  }

  .read-opt-header {
    -webkit-transition: opacity .15s, -webkit-transform .15s, visibility .15s;
    transition: opacity .15s, transform .15s, visibility .15s;
    color: #fff;
    border-bottom: 0;
    background-color: rgba(0, 0, 0, .9);
    transform: translateY(0);
  }

  .read-join-sj {
    color: #fff;
    font-size: 0.8125rem;
    line-height: 2rem;
    position: absolute;
    top: 3.75rem;
    right: 0;
    padding: 0 .5rem 0 .75rem;
    transition: color .15s, transform .15s;
    transform: translateX(100%);
    border-radius: 3rem 0 0 3rem;
    background: rgba(0, 0, 0, .9);
    border: none;
  }

  .read-opt-bot {
    position: absolute;
    right: 0;
    bottom: 3rem;
    left: 0;
    visibility: hidden;
    transform: translateY(.5px);
    opacity: 0;
    background-clip: padding-box;

    .read-set-layout, .read-set-skin {
      padding: 0.9375rem 0 0.9375rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, .1);
    }

    .skin-label {
      svg {
        opacity: 0;
      }

      &.skinActive {
        border-color: #ed424b;

        svg {
          opacity: 1;
        }
      }
    }
  }

  .read-set-cell {
    position: relative;

    input {
      position: absolute;
      z-index: 1;
      width: 100%;
      width: calc(100% - 1.25rem);
      height: 100%;
      margin: 0;
      opacity: 0;
    }

    label {
      height: 1.5rem;
      border-radius: 0.2rem;
      margin-right: 1.25rem;
      border: 1px solid;
    }
  }

  .read-btn-layout {
    font-size: .8125rem;
    line-height: 1.6875rem;
    display: block;
    -webkit-transition: opacity .15s;
    transition: opacity .15s;
    text-align: center;
    opacity: 1;
    border: 1px solid #fff;
    border-radius: 3px;

    &.nochange {
      opacity: 0.4;
    }
  }

  .active {
    visibility: visible;
    transition: none;
    opacity: 1;

    .read-join-sj {
      transform: translateX(0);
    }
  }

  footer {
    .van-tabbar {
      background: rgba(0, 0, 0, .9);
    }
  }

  .page-rss {
    position: fixed;
    z-index: 29;
    top: 15%;
    left: 20%;
    width: 60%;
    height: 45%;
  }

</style>
