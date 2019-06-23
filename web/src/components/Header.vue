<template>
  <div class="header">
    <van-nav-bar :fixed="true" :z-index="100">
      <van-icon class="fs-18 text-gray" class-prefix="my-icon" name="ico-left-arrow" slot="left"/>
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
        <van-icon class="fs-18 mr-1 text-gray" class-prefix="my-icon" name="searchicon"/>
        <van-icon class="fs-18 text-gray"
                  class-prefix="my-icon"
                  name="zhang"
                  @click="toggleGuide"
        />
      </div>
    </van-nav-bar>
    <div class="guide" :class="{active:guideActive}">
      <i class="guide-overlay" role="button" title="点击收起" @click="toggleGuide"></i>
      <div class="guide-content">
        <nav class="guide-nav mt-2">
          <van-tabbar v-model="tabarItem" :fixed="false" :border="false">
            <van-tabbar-item>
              <van-icon slot="icon" class="fs-18 text-red" class-prefix="my-icon" name="shouye"/>
              <span>首页</span>
            </van-tabbar-item>
            <van-tabbar-item>
              <van-icon slot="icon" class="fs-18 text-blue" class-prefix="my-icon" name="fenlei"/>
              <span>分类</span>
            </van-tabbar-item>
            <van-tabbar-item>
              <van-icon slot="icon" class="fs-18 text-red" class-prefix="my-icon" name="paixing"/>
              <span>排行</span>
            </van-tabbar-item>
          </van-tabbar>
        </nav>
        <div class="guide-footer">
          <van-button class="btn" data-size="14" type="danger" size="small">我的书架</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Header',
    props: {
      items: { type: Array, required: true }
    },
    data () {
      return {
        show: false,
        active: 0,
        guideActive: false,
        tabarItem: 0
      }
    },
    methods: {
      showPopup () {
        this.show = true
      },
      toggleGuide () {
        this.guideActive = !this.guideActive
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";

  .header {
    height: 2.75rem;
  }

  #popupid {
    position: absolute;
    top: 2.75rem;
  }

  .nav {
    display: flex;

    .nav-item {
      font-size: map_get($font-sizes,'13')*$base-font-size;
      font-weight: 400;
      color: map_get($colors, 'red');
      border: 1px solid map_get($colors, 'red');

      .nav-link {
        line-height: 1.5rem;
        padding: 0 .75rem;
      }

      &.active {
        color: map_get($colors, 'white');
        background-color: map_get($colors, 'red');
      }
    }

    :first-child {
      border-radius: 0.25rem 0 0 0.25rem;
    }

    :last-child {
      border-radius: 0 0.25rem 0.25rem 0;
    }
  }

  .guide {
    position: fixed;
    z-index: 3;
    top: 2.5rem;
    right: 0;
    bottom: 0;
    left: 0;
    visibility: hidden;
    overflow: hidden;
    transition: visibility .25s;
    -wekit-transition: visibility 0.25s;

    .guide-content {
      position: relative;
      overflow: hidden;
      padding: 0 1rem;
      transition: transform 0.15s;
      transform: translateY(-100%);
      background-color: #fff
    }

    &.active {
      visibility: visible;
      transition: none;

      .guide-content {
        -webkit-transform: translateY(0);
        transform: translateY(0)
      }

      .guide-overlay {
        opacity: 0.6;
      }
    }

    .guide-overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0
    }

    .guide-overlay {
      transition: opacity 0.25s;
      opacity: 0;
      background-color: #000
    }
    .guide-footer{
      margin-top: 1rem;
      margin-bottom: 1.5rem;
      text-align: center;
      .btn{
        border-radius: 99px;
      }
    }
  }
</style>
