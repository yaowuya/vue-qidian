<template>
  <div :class="[{'header':!isFixed,'header-fixed':isFixed}]" >
    <van-nav-bar :z-index="100">
      <div slot="left">
        <van-icon class="fs-18 text-gray" class-prefix="my-icon" name="ico-left-arrow" @click="$router.go(-1)"/>
        <span class="header-title">{{title}}</span>
      </div>
      <!--headerItems值如果为空，头部中间部分就为空-->
      <div slot="title" class="pt-2" v-if="this.headerItems.length>0">
        <div class="nav jc-center">
          <div class="nav-item"
               v-for="(item,i) in this.headerItems"
               :class="{ active: itemType === item.name }"
               :key="i"
               @click="itemChange(item.name)"
          >
            <div class="nav-link">{{item.text}}</div>
          </div>
        </div>
      </div>
      <div slot="right">
        <van-icon class="fs-18 mr-1 text-gray" class-prefix="my-icon" name="searchicon" @click="goSearch"/>
        <van-icon v-if="isHomePage" class="fs-18 text-red mt-1"
                  class-prefix="my-icon"
                  name="shujia"
                  @click="toShelf"
        />
        <van-icon v-else class="fs-18 text-gray"
                  class-prefix="my-icon"
                  :name="guide.icon"
                  @click="toggleGuide"
        />
      </div>
    </van-nav-bar>
    <div class="guide" :class="{active:guide.active}">
      <i class="guide-overlay" role="button" title="点击收起" @click="toggleGuide"></i>
      <div class="guide-content">
        <nav class="guide-nav mt-2">
          <Navbar></Navbar>
        </nav>
        <div class="guide-footer">
          <van-button @click="toShelf" class="btn" data-size="14" type="danger" size="small">我的书架</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { HOME_PAGE } from '../utils/storage'
  import Navbar from '../components/Navbar'

  export default {
    name: 'Header',
    props: {
      itemName: {
        type: String,
        default: ''
      },
      title: { type: String, required: true },
      isFixed:{type:Boolean,default: false}
    },
    components: {
      Navbar
    },
    computed: {
      ...mapState([
        'headerTitle',
        'headerType',
        'headerItems'
      ])
    },
    data () {
      return {
        guide: {
          icon: 'zhang',
          active: false
        },
        tabarItem: 5,
        isHomePage: false,
        itemType: ''
      }
    },
    created () {
      if (this.headerType === HOME_PAGE) {
        this.isHomePage = true
      } else {
        this.isHomePage = false
      }
      this.itemType = this.itemName
    },
    methods: {
      itemChange (item) {
        this.itemType = item
        this.$emit('item-change', item)
      },
      toggleGuide () {
        this.tabarItem = 5
        this.guide.active = !this.guide.active
        this.guide.active ? this.guide.icon = 'x' : this.guide.icon = 'zhang'
      },
      toShelf () {
        return this.$router.push({ name:"Shelf" })
      },
      goSearch(){
        return this.$router.push({name:"Search"})
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/variable";

  .van-nav-bar {
    background-color: rgba(255, 255, 255, 0.2) !important; //透明
  }

  .header {
    position: relative;
    height: 2.75rem;
  }

  .header-fixed{
    position: fixed;
    height: 2.75rem;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background-color: map_get($colors,"white");
    /*border-bottom: 0.006rem solid map_get($colors,"gray");*/
  }

  .header-title {
    font-size: 0.8rem;
    font-weight: 400;
    line-height: 1.375rem;
    position: absolute;
    left: 1.3rem;
    top: 0.6rem;
    overflow: hidden;
    /*max-width: 60%;*/
    white-space: nowrap;
    text-overflow: ellipsis;
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
    z-index: 10;
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

    .guide-footer {
      margin-top: 1rem;
      margin-bottom: 1.5rem;
      text-align: center;

      .btn {
        border-radius: 99px;
      }
    }
  }
</style>
