<template>
  <div class="home unlogin-page">
    <Header :items="itemsData"></Header>
    <div class="pa w-100 h-100 d-flex jc-center ai-center">
      <van-icon class="fs-18 mr-1 text-lowgrey" class-prefix="my-icon" name="searchicon"/>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header"
export default {
  name: 'home',
  components: {
    Header
  },
  data(){
    return{
      itemsData:["我的书架","最近阅读"]
    }
  }
}
</script>

<style scoped lang="scss">
  .pa{
    position: absolute;
  }
</style>
