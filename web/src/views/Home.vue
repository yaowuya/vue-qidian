<template>
  <!--主页-->
  <div class="home bg-lowergrey">
    <Header :item-name="itemName" @item-change="homeChange"></Header>
    <div class="swipe-container">
      <van-swipe :autoplay="3000"
                 show-indicators
                 indicator-color="white"
                 loop
                 class="van-swipe"
      >
        <van-swipe-item
          v-for="(pic,i) in swipePic"
          :key="i"
        >
          <van-image
            fit="contain"
            :src="pic.src"
            :alt="pic.alt"
          />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="bar py-2">
      <navbar></navbar>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import Header from '../components/Header'
  import Navbar from "../components/Navbar"
  import { SHELF_PAGE, HOME_PAGE } from '../utils/storage'

  export default {
    name: 'Home',
    components: {
      Header,
      Navbar
    },
    data () {
      return {
        itemName: 'male',
        swipePic: [
          { src: require('../assets/images/home1.jpg'), alt: '' },
          { src: require('../assets/images/home2.jpg'), alt: '' },
          { src: require('../assets/images/home3.jpg'), alt: '' },
          { src: require('../assets/images/home4.jpg'), alt: '' },
          { src: require('../assets/images/home5.jpg'), alt: '' },
        ],
        barItem: 5
      }
    },
    created () {
      this.SET_HEADER_INFO({
        title: '主页',
        type: HOME_PAGE,
        items: [
          { name: 'male', text: '男生' },
          { name: 'female', text: '女生' },
        ],
      })
    },
    methods: {
      ...mapMutations([
        'SET_HEADER_INFO'
      ]),
      homeChange (item) {
        console.log(item)
      },

    }
  }
</script>

<style scoped lang="scss">
  .swipe-container {
    position: relative;
    overflow: hidden;
    height: 7rem;
    height: calc(.314 * (100vw - 1.5rem));
    margin: 0 0.75rem;
  }

  .van-swipe {
    height: 7rem;
    height: calc(.314 * (100vw - 1.5rem));
  }
</style>
