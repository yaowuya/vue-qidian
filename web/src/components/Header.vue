<template>
  <div class="header">
    <van-nav-bar :fixed="true" :z-index="100">
      <van-icon class="fs-18 text-lowgrey" class-prefix="my-icon" name="ico-left-arrow" slot="left"/>
      <div slot="title" class="pt-2">
        <div class="nav jc-center">
          <div class="nav-item" :class="{active:active===i}"
               v-for="(item,i) in items"
               :key="i"
               @click="active=i"
          >
            <div class="nav-link">{{item}}</div>
          </div>
        </div>
      </div>
      <div slot="right">
        <van-icon class="fs-18 mr-1 text-lowgrey" class-prefix="my-icon" name="searchicon"/>
        <van-icon class="fs-18 text-lowgrey"
                  class-prefix="my-icon"
                  name="zhang"
                  @click="showPopup"
        />
      </div>
    </van-nav-bar>
    <van-popup v-model="show"
               position="top"
               :style="{ height: '20%' }"
    >内容
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: 'Header',
    props:{
      items:{type:Array,required:true}
    },
    data () {
      return {
        show: false,
        active: 0,
      }
    },
    methods: {
      showPopup () {
        this.show = true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";
  .header {
    height: 2.75rem;
  }
  .nav{
    display: flex;
    .nav-item{
      font-size: map_get($font-sizes,'13')*$base-font-size;
      font-weight: 400;
      color: map_get($colors, 'red');
      border: 1px solid map_get($colors, 'red');
      .nav-link{
        line-height: 1.5rem;
        padding: 0 .75rem;
      }
      &.active{
        color:map_get($colors, 'white');
        background-color:map_get($colors, 'red');
      }
    }
    :first-child{
      border-radius: 4px 0 0 4px;
    }
    :last-child{
      border-radius: 0 4px 4px 0;
    }
  }
</style>
