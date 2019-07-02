<template>
  <section class="cat-bar">
    <div class="filter-item-list" v-show="!isBrief">
      <div class="filter-item">
        <van-tabbar
          :fixed="false"
          v-model="selectActive"
          active-color="#ed424b"
          inactive-color="#000"
          :border="false"
        >
          <van-tabbar-item v-for="(type,i) in typeList"
                           :key="i"
                           @click="filterChange(type.name,type.value)"
          >
            {{type.name}}
          </van-tabbar-item>
        </van-tabbar>
      </div>
      <div class="filter-item">
          <van-tabbar
            :fixed="false"
            v-model="minorActive"
            active-color="#ed424b"
            inactive-color="#000"
            :border="false"
          >
            <van-tabbar-item v-for="(minor,i) in minorList"
                             :key="i"
                             @click="filterChange(minor,null)"
            >
              {{minor}}
            </van-tabbar-item>
          </van-tabbar>
      </div>
    </div>
    <div class="filter-result-list" v-show="isBrief" @click="spreadFilter">
      <span>{{ selectedMinor }}</span>
      <span>-</span>
      <span>按{{ selectedTypeName }}</span>
      <svg-icon icon-class="bottom-arrow"></svg-icon>
    </div>
  </section>
</template>

<script>
  import api from "../api/api"
  import {debounce} from "../utils/storage"
  export default {
    name: "CatBar",
    props: {
      gender: String,
      major: String
    },
    data() {
      return {
        selectActive:0,
        minorActive:0,
        typeList: [{
          value: 'hot',
          name: '热门'
        }, {
          value: 'new',
          name: '新书'
        }, {
          value: 'reputation',
          name: '好评'
        }, {
          value: 'over',
          name: '完结'
        }, {
          value: 'monthly',
          name: '包月'
        }],
        selectedType: 'hot',
        selectedTypeName: '热门',
        minorList: ['全部'],
        selectedMinor: '全部',
        isBrief: false,
        $docElement: null,
        $body: null
      }
    },
    created() {
      api.getMinorList()
        .then(data => {
          for (let [index, elem] of data[this.gender].entries()) {
            if (elem.major === this.major) {
              this.minorList.push(...elem.mins);
              return;
            }
          }
        })
    },
    mounted() {
      this.$docElement = document.documentElement;
      this.$body = document.body;
      window.addEventListener('scroll', debounce(this.showBrief));
    },
    methods:{
      showBrief: function() {
        console.log("catBar-scrolltop:",this.$body.scrollTop,this.$docElement.scrollTop);
        if ((this.$body.scrollTop + this.$docElement.scrollTop) > 40) {
          this.isBrief = true;
        } else {
          this.isBrief = false;
        }
        console.log(this.isBrief);
      },
      filterChange(name,type){
        console.log(name,type);
        if(type){
          this.selectedType = type;
          this.selectedTypeName = name;
        }else {
          this.selectedMinor =name;
        }
        this.$emit('filter-change', this.selectedType, this.selectedMinor === '全部' ? '' : this.selectedMinor);
      },
      spreadFilter: function() {
        this.isBrief = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";
  .cat-bar{
    position: fixed;
    top: 2.7rem;
    left: 0;
    right: 0;
    z-index:2;
  }
  .filter-item-list{
    position: absolute;
    top: 0rem;
    left: 0;
    width: 100%;
    color: #666;
    background-color: #fff;
    opacity: 1;
    transition: all .1s ease;
    z-index: 2;
    .filter-item{
      position: relative;
      width: 100%;
      /*height: 1.2rem;*/
      /*line-height: 1.2rem;*/
      overflow-x: auto;
      border-bottom: 0.006rem solid map_get($colors,"gray");
    }
  }
  .filter-result-list{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    line-height: 1.5rem;
    text-align: center;
    color: #666;
    background-color: #fff;
    z-index: 2;
    border-bottom: 0.006rem solid map_get($colors,"gray");
    span{
      padding: 0 .06667rem;
      display: inline-block;
      vertical-align: middle;
      font-size:0.75rem  /* 12/16 */;
    }
  }

  .van-tabbar-item{
    flex-wrap: wrap;
    word-break: keep-all;
    flex: 0;
    padding: 0 0.5rem;
  }
</style>
