<template>
  <div class="home unlogin-page">
    <Header :items="itemsData"></Header>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Header from '../components/Header'

  export default {
    name: 'Main',
    components: {
      Header
    },
    data () {
      return {
        itemsData: ['我的书架', '最近阅读'],
        show:true
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
