<template>
  <section class="recommend bg-white">
    <template v-if="recommendList.length > 0">
      <div class="module">
        <div class="module-header mb-1">
          <div class="module-header-l">
            <h3 class="module-title">同类推荐</h3>
          </div>
          <div class="module-header-r">
            <router-link :to="{ name: 'BookList', params: {id : curBook.id}}" class="module-header-btn">
              更多
              <svg-icon class="text-lowergrey" icon-class="right-arrow"/>
            </router-link>
          </div>
        </div>
        <div class="module-slide">
          <ol class="module-slide-ol">
            <li class="module-slide-li"  v-for="(recommend, index) in recommendList" :key="index">
              <router-link class="module-slide-a" :to="{}">
                <img :src="recommend.cover | setCover" :alt="recommend.title" class="module-slide-img">
                <figcaption  class="module-slide-caption">{{ recommend.title }}</figcaption >
                <p class="module-slide-author">
                  <span class="text-gray">{{recommend.author}}</span>
                </p>
              </router-link>
            </li>
          </ol>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
  import {mapState} from "vuex"
  import {staticPath} from "../utils/storage"
  import api from "../api/api"

  export default {
    name: "Recommend",
    data() {
      return {
        recommendList: []
      }
    },
    filters: {
      setCover(cover) {
        return staticPath + cover;
      }
    },
    computed: {
      ...mapState([
        'curBook'
      ])
    },
    created() {
      api.getRecommend(this.curBook.id)
        .then(data => {
          this.recommendList = data;
          console.log("推荐",data);
        })
    }
  }
</script>

<style scoped>

</style>
