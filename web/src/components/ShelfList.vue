<template>
  <section class="shelf-list bg-white">
    <ol class="book-ol book-ol-progress" v-if="shelfBookList.length > 0">
      <li class="book-li" v-for="book in shelfBookList" :key="book.id">
        <div class="book-layout">
          <div class="rel">
            <div class="mybook-to-detail">
              <img class="book-cover" :src="book.cover" :alt="book.title" @click="toBookList(book.id)">
            </div>
            <router-link class="book-title-x" :to="{name:'BookDetail',params:{id:book.id}}">
              <h4 class="book-title">{{book.title}}</h4>
            </router-link>
          </div>
          <router-link :to="{name:'Read',params:{id:book.id}}">
            <div class="mybook-to-goon">
              <div class="book-title-x">
                <div class="book-title-r text-gray">{{book.updated|time}}</div>
              </div>
              <div class="book-meta">
                <p class="ell">
                  <svg-icon class="text-lowergrey" icon-class="seeusero"/>
                  {{book.author}}
                </p>
              </div>
            </div>
            <div class="rel">
              <div class="mybook-to-new">
                <div class="book-meta">
                  <p class="cell">
                    更新至 {{book.lastChapter}}
                  </p>
                  <span class="book-meta-r">
                  <svg-icon icon-class="delete" @click.prevent="deleteBook(book.id)"></svg-icon>
                </span>
                </div>
              </div>
            </div>
          </router-link>

        </div>
      </li>
    </ol>
  </section>
</template>

<script>
  import {mapState, mapMutations} from "vuex"
  import moment from "moment"
  import api from "../api/api"
  import { Dialog } from 'vant';

  export default {
    name: "ShelfList",
    data() {
      return {}
    },
    filters: {
      time(updated) {
        moment.locale('zh-cn');
        return moment(updated).fromNow();
      }
    },
    computed: {
      ...mapState([
        "shelfBookList"
      ])
    },
    created() {
      this.fectchData();
    },
    methods: {
      ...mapMutations([
        'SHELF_BOOK_UPDATE',
        'DEL_FROM_SHELF'
      ]),
      fectchData(){
        let bookIds = this.shelfBookList.map(book => {
          return book.id
        });
        api.getShelfBookUpdate(bookIds).then(data => {
          this.SHELF_BOOK_UPDATE(data);
          this.$emit("load-result");
          console.log("书架:", this.shelfBookList);
        })
      },
      deleteBook: function (bookId) {
        Dialog.confirm({
          title: '温馨提示',
          message: '是否确定从书架中删除'
        }).then(() => {
          // on confirm
          this.DEL_FROM_SHELF([bookId]);
          this.fectchData();
        }).catch(() => {
          // on cancel
        });

      },
      toBookList(bookId) {
        return this.$router.push({name: "BookDetail", params: {id: bookId}})
      }
    }

  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";
  .book-ol-progress {
    .book-cover {
      width: 3.375rem;
      height: 4.5rem;
      margin-right: .75rem;
    }
  }

  .book-layout {
    padding: 0 1rem 1.2rem 1rem;
    border-bottom: 1px solid map_get($colors,"lowerdark");
    .book-title{
      font-size: 1rem;
    }
  }

  .rel {
    position: relative;
  }

  .mybook-to-detail {
    position: absolute;
    top: 1rem;
    white-space: nowrap;
    .book-cover{
      margin-right: 0;
    }
  }
  .mybook-to-detail + .book-title-x {
    position: absolute;
    top: 1rem;
    right: 4.125rem;
    left: 4.125rem;
  }

  .mybook-to-goon {
    display: block;
    min-height: 4.5rem;
    margin: 0 -1rem;
    padding: 1rem 1rem 1rem 5.125rem;

    .book-meta {
      margin: .25rem 0;
    }
  }
  .mybook-to-new {
    line-height: 1.5rem;
    position: absolute;
    top: -0.8rem;
    right: 0;
    left: 4.125rem;
    p{
      width: 120rem;
      width: 60vw;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    svg{
      padding-bottom: 0.1rem;
    }
  }

</style>
