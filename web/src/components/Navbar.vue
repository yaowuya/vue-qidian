<template>
  <van-tabbar route v-model="barItem" :fixed="false" :border="false" inactive-color="#ed424b"  active-color="#969ba3">
    <van-tabbar-item replace to="/home">
      <van-icon slot="icon" class="fs-18" class-prefix="my-icon" name="shouye"/>
      <span>首页</span>
    </van-tabbar-item>
    <van-tabbar-item replace to="/category">
      <van-icon slot="icon" class="fs-18" class-prefix="my-icon" name="fenlei"/>
      <span>分类</span>
    </van-tabbar-item>
    <van-tabbar-item replace to="/rank">
      <van-icon slot="icon" class="fs-18" class-prefix="my-icon" name="paixing"/>
      <span>排行</span>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
  export default {
    name: 'Navbar',
    data(){
      return{
        barItem:5
      }
    }
  }
</script>

<style scoped>

</style>
