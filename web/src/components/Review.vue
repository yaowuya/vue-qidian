<template>
  <section class="review bg-white mb-2">
    <div class="review-head">
      <h3 class="review-title fs-13 text-lowergray py-1 pl-3">热门书评</h3>
    </div>
    <template v-if="reviewList.length>0">
      <div class="review-body">
        <div class="review-item" v-for="review in reviewList" :key="review._id">
          <div class="inner">
            <img :src="review.author.avatar | setAvatar" alt="" class="avater">
            <div class="right">
              <p class="p-name">{{ review.author.nickname }}</p>
              <p class="p-title">{{ review.title }}</p>
              <p class="p-score">
                <van-rate
                  v-model="review.rating"
                  allow-half
                  void-icon="star"
                  void-color="#eee"
                  :count="Math.ceil(review.rating||1)"
                  readonly
                  size="5"
                />
              </p>
              <p class="p-content">{{review.content}}</p>
              <p class="p-love">
                <span class="float-left">{{review.updated|time}}</span>
                <span class="float-right">{{review.helpful.yes}}人觉得有用</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
  import {mapState} from "vuex"
  import api from "../api/api"
  import {staticPath} from "../utils/storage"
  import moment from "moment"

  export default {
    name: "Review",
    data() {
      return {
        reviewList: []
      }
    },
    filters: {
      time(update) {
        return moment(update).format('YYYY-MM-DD');
      },
      setAvatar(avatar) {
        return staticPath + avatar;
      }
    },
    computed: {
      ...mapState([
        'curBook'
      ])
    },
    created() {
      api.getReview(this.curBook.id)
        .then(data => {
          this.reviewList = data;
          console.log("评论：",data);
        })
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";
  .review-head{
    /*height: 1.875rem  !* 30/16 *!;*/
    position: relative;
    border-bottom: 1px solid map_get($colors,"lowerdark");
    padding:0.2rem;
    overflow: hidden;
    .review-title{
      float: left;
      font-weight: 400;
    }
  }
  .review-body{
    padding:0 1rem;
  }
  .review-item{
    padding-top: 0.5rem;
    border-bottom: 1px solid map_get($colors,"lowerdark");
    &:last-child{
      border-bottom:none;
    }
    .inner{
      position: relative;
      padding-left: 2.4rem;
      padding-bottom:0.2rem;
    }
    .avater{
      position: absolute;
      top: 0;
      left: 0;
      width: 2rem;
      height:2rem;
      border-radius: 0.9rem;
    }
    .right{
      .p-name{
        position: relative;
        height: 1rem;
        line-height: 1rem;
        color: #a58d5e;
        font-size: 0.75rem;
      }
      .p-title{
        height: 1rem;
        line-height: 1rem;
        font-weight: 700;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #000;
      }
      .p-score{
        height:1rem;
      }
      .p-content{
        overflow: hidden;
        line-height: 1rem;
        text-align: justify;
      }
      .p-love{
        padding-top: .13333rem;
        height: 1rem;
        overflow: hidden;
        color: map_get($colors,"gray");
      }
    }
  }
</style>
