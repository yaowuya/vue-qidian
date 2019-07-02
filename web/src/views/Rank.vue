<template>
  <section class="rank bg-white">
    <Header :isFixed="true" :item-name="sex" @item-change="itemChange" title="排行榜"></Header>
    <div class="rank-bar">
      <template v-if="sex==='male'">
        <van-sidebar :active-key="maleKey" @change="onMaleChange">
          <van-sidebar-item
            v-for="rank in maleRankList"
            @click="changeRankId(rank._id)"
            :key="rank._id"
            :title="rank.shortTitle"
          />
        </van-sidebar>
      </template>
      <template v-if="sex==='female'">
        <van-sidebar :active-key="femaleKey" @change="onFemaleChange">
          <van-sidebar-item
            v-for="rank in femaleRankList"
            @click="changeRankId(rank._id)"
            :key="rank._id"
            :title="rank.shortTitle"
          />
        </van-sidebar>
      </template>
    </div>
    <div class="rank-book">
      <list-card :book-list="bookList" v-if="bookList.length > 0"></list-card>
    </div>
  </section>
</template>

<script>
  import Header from "../components/Header";
  import {mapMutations} from "vuex"
  import {RANK_PAGE} from "../utils/storage"
  import {loading} from "../utils/toast"
  import api from "../api/api"
  import ListCard from "../components/ListCard";

  export default {
    name: "Rank",
    components: {
      ListCard,
      Header
    },
    data(){
      return{
        maleKey:0,
        femaleKey:0,
        sex: 'male',
        maleRankList: [],
        femaleRankList: [],
        rankId: '',
        bookList: [],
        isShowPageLoading: true,
        isLoading: true
      }
    },
    watch:{
      rankId: function () {
        loading.showLoading();
        this.bookList = [];
        api.getRankBooks(this.rankId)
          .then(data => {
            this.bookList = data.ranking.books;
            loading.closeLoding();
          })
      }
    },
    created() {
      this.SET_HEADER_INFO({
        title: '排行榜',
        type: RANK_PAGE,
        items: [
          {name: 'male', text: '男生'},
          {name: 'female', text: '女生'},
        ],
      });
      this.fetchData();
    },
    methods:{
      ...mapMutations([
        'SET_HEADER_INFO'
      ]),
      onMaleChange(key) {
        this.maleKey = key;
      },
      onFemaleChange(key){
        this.femaleKey=key;
      },
      itemChange(item) {
        document.body.scrollTop = 0;
        if (this.sex === item) {
          return;
        } else {
          this.sex = item;
          this.rankId = item === 'male' ? this.maleRankList[0]._id : this.femaleRankList[0]._id;
        }
      },
      fetchData: function () {
        loading.showLoading();
        api.getRanks()
          .then(data => {
            console.log("排行：",data);
            this.maleRankList = data.male;
            this.femaleRankList = data.female;
            this.rankId = this.maleRankList[0]._id;
            loading.closeLoding();
          })
      },
      changeRankId: function(rankId) {
        this.rankId = rankId;
      }
    }
  }
</script>

<style scoped lang="scss">
  .rank{
    position: relative;
    .rank-bar{
      width: 4rem  /* 80/16 */;
      position: fixed;
      top: 2.75rem;
      left: 0;
      bottom: 3.75rem  /* 60/16 */;
      overflow-y: auto;
    }
    .rank-book{
      position: relative;
      margin: 2.75rem 0 5rem 4rem;
    }
  }
</style>
