<template>
  <ol class="book-ol book-ol-normal">
    <li class="book-li" v-for="book in bookList" :key="book._id">
      <div class="book-layout">
        <router-link :to="{name:'BookDetail',params:{id:book._id}}">
          <img :src="book.cover|setCover" alt="" class="book-cover">
          <div class="book-cell">
            <h4 class="book-title">
              {{book.title}}
            </h4>
            <template v-if="!isAuthor">
              <p class="book-desc">
                {{ book.shortIntro }}
              </p>
              <div class="book-meta">
                <div class="book-meta-l">
                <span class="book-author" role="option" >
                  <svg-icon class="text-lowergrey" icon-class="seeusero"/>
                  {{ book.author }}
                </span>
                </div>
                <div class="book-meta-r">
                <span class="tag-small-group origin-right">
                  <template v-if="isRatio">
                    <em class="tag-small text-red">
                      {{ book.retentionRatio | setRetentionRatio }}%留存
                    </em>
                  </template>
                  <template v-else>
                    <em class="tag-small text-gray">
                      {{ book.majorCate }}
                    </em>
                    <em class="tag-small text-red">
                      {{ book.isSerial ? '连载中' : '完结' }}
                    </em>
                  </template>
                  <em class="tag-small text-blue">
                    {{book.latelyFollower|setLatelyFollower}}人气
                  </em>
                </span>
                </div>
              </div>
            </template>
            <template v-else>
              <p class="book-author-rank">
                <span class="book-author" role="option" >
                  <svg-icon class="text-lowergrey" icon-class="seeusero"/>
                  {{ book.author }}
                </span>
              </p>
              <p class="book-desc book-desc-rank">
                {{ book.shortIntro }}
              </p>
              <div class="book-meta">
                <span class="tag-small-group-rank">
                    <em class="tag-small text-red">
                      {{ book.retentionRatio | setRetentionRatio }}%留存
                    </em>
                  <em class="tag-small text-blue">
                    {{book.latelyFollower|setLatelyFollower}}人气
                  </em>
                </span>
              </div>
            </template>


          </div>
        </router-link>
      </div>
    </li>
  </ol>
</template>

<script>
  import { RANK_PAGE, staticPath } from '../utils/storage'
  import { mapState } from 'vuex'

  export default {
    name: 'ListCard',
    props: {
      bookList: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        isRatio: false,
        isAuthor:false,
      }
    },
    computed: {
      ...mapState([
        'headerType'
      ])
    },
    created () {
      this.headerType === RANK_PAGE ? this.isRatio = true : this.isRatio = false
      this.headerType === RANK_PAGE ? this.isAuthor = true : this.isAuthor = false
    },
    filters: {
      setLatelyFollower (latelyFollower) {
        return latelyFollower < 10000 ? latelyFollower : (latelyFollower / 10000).toFixed(1) + '万'
      },

      setRetentionRatio (retentionRatio) {
        return parseFloat(retentionRatio).toFixed(1)
      },

      setCover (cover) {
        if (cover.indexOf(staticPath) > -1) {
          return cover
        }
        return staticPath + cover
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";

  .book-ol {
    &::before {
      display: block;
      clear: both;
      height: 0;
      content: '';
      visibility: hidden;
    }

    .book-li {
      &::after {
        display: block;
        margin-top: -1Px;
        margin-left: 1rem;
        content: '';
        transition: margin-left 0.15s;
        border-bottom: 1Px solid #f0f1f2;
      }

      &:last-child::after {
        display: none
      }
    }

    .book-layout {
      padding: 0.6rem;
    }

    .book-cell {
      overflow: hidden;
    }

    .book-title {
      font-size: 1rem;
    }

    .book-desc {
      font-size: 0.875rem /* 14/16 */;
      line-height: 1.125rem;
      overflow: hidden;
      margin: 0.5rem 0;
      color: #969ba3
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
    .book-author-rank{
      line-height: 1.1rem;
    }

    .tag-small-group-rank{
      position: absolute;
      left: 1.8rem;
      white-space: nowrap;
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

  .book-desc-rank{
    height: 1rem !important;
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
