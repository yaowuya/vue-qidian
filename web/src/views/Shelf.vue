<template>
  <!--  我的书架-->
  <div class="home unlogin-page">
    <Header :item-name="itemName" :item-change="shelfChange"></Header>
    <div class="pa w-100 h-100 d-flex jc-center ai-center">
      <van-icon class="icon-body fs-18 mr-1 text-gray" class-prefix="my-icon" name="read"/>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from "vuex"
  import Header from '../components/Header'
  import {SHELF_PAGE} from '../utils/storage';

  export default {
    name: 'Main',
    components: {
      Header
    },
    data() {
      return {
        itemName:"myShelf"
      }
    },
    created() {
      this.SET_HEADER_INFO({
        title: '我的书架',
        type: "HOMEPAGE",
        items:[
          {name:"myShelf",text:"我的书架"},
          {name:"recentRead",text:"最近阅读"},
        ],
      });
    },
    methods: {
      shelfChange(item) {
        console.log(item);
      },
      ...mapMutations([
        'SET_HEADER_INFO'//映射 this.SET_HEADER_INFO() 为 this.$store.commit('SET_HEADER_INFO')
      ])
    }
  }
</script>

<style scoped lang="scss">
  .pa {
    position: absolute;
  }

  .icon-body {
    font-size: 76px;
    color: #b4b8be;
    cursor: pointer;
  }
</style>
