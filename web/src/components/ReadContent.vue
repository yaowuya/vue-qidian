<template>
  <section class="read-content" :class="[skinColor,{'read-night':nightMode}]">
    <div class="page-read-opt active">
      <header class="header read-opt-header">
        <p class="header-back">
          <van-icon class="fs-18 text-white" class-prefix="my-icon" name="ico-left-arrow" @click="$router.go(-1)"/>
        </p>
      </header>
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
            <h3 class="title" >{{rc.contentTitle}}</h3>
            <p v-for="(content,i) in rc.contentList"
               :key="i">
              {{content}}
            </p>
          </section>
        </article>
        <div class="read-load-next">
          <button class="btn-normal">加载下一章</button>
        </div>
      </div>
    </div>
    <div class="page-read-top">
      <h1 class="read-book-name">{{ curBook.title }}</h1>
    </div>
  </section>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

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
    data () {
      return {
        isAdded: false,
        isShowOpt: false,
        isShowSet: false,
        skinBgList: ['skin-default', 'skin-blue', 'skin-green', 'skin-pink', 'skin-dark', 'skin-light']
      }
    },
    created () {
      this.isAdded = this.curBook.isInShelf
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
      padding-top: 2.75rem;
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
      font-weight: 400;
      line-height: 1.2;
      margin: 1em 0;
    }

    p {
      font-size: 1em;
      margin: 0.5em 0;
      text-indent: 2em;
      letter-spacing: 0.0625rem  /* 1/16 */ ;
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

</style>
