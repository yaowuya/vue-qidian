<template>
  <!--  我的书架-->
  <div class="shelf">
    <Header title="书架" :item-name="itemName" @item-change="shelfChange"></Header>
    <shelf-list v-if="shelfBookList.length>0" @load-result="loadResult"></shelf-list>
    <div v-else class="pa w-100 h-100 d-flex jc-center ai-center">
      <van-icon class="icon-body fs-18 mr-1 text-gray" class-prefix="my-icon" name="read"/>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from "vuex"
  import Header from '../components/Header'
  import {SHELF_PAGE} from '../utils/storage';
  import ShelfList from "../components/ShelfList";
  import {loading} from "../utils/toast"

  export default {
    name: 'Main',
    components: {
      ShelfList,
      Header
    },
    data() {
      return {
        itemName:"myShelf"
      }
    },
    created() {
      this.SET_HEADER_INFO({
        title: '书架',
        type: SHELF_PAGE,
        items:[
          {name:"myShelf",text:"我的书架"},
          {name:"recentRead",text:"最近阅读"},
        ],
      });
      loading.showLoading();
    },
    computed:{
      ...mapState([
        'shelfBookList'
      ])
    },
    methods: {
      shelfChange(item) {
        console.log(item);
      },
      ...mapMutations([
        'SET_HEADER_INFO'//映射 this.SET_HEADER_INFO() 为 this.$store.commit('SET_HEADER_INFO')
      ]),
      loadResult(){
        loading.closeLoding();
      }
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
