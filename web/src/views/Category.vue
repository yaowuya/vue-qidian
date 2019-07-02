<template>
  <section class="category bg-white">
    <Header title="分类"></Header>
    <cat v-for="category in categories"
         :key="category.title"
         :category="category">

    </cat>
  </section>
</template>

<script>
  import Header from "../components/Header"
  import api from "../api/api"
  import {CATEGORY_PAGE} from "../utils/storage"
  import {loading} from "../utils/toast"
  import {mapMutations} from "vuex"
  import Cat from "../components/Cat";
  export default {
    name: "Category",
    components: {
      Cat,
      Header
    },
    data() {
      return {
        categories:[]
      }
    },
    created() {
      this.SET_HEADER_INFO({
        title: '分类',
        type: CATEGORY_PAGE,
        items:[]
      });
      this.fetchData();
    },
    methods:{
      ...mapMutations([
        'SET_HEADER_INFO'
      ]),
      fetchData: function() {
        loading.showLoading();
        api.getCategory()
          .then(data => {
            console.log("分类",data);
            for (let [key, value] of Object.entries(data)) {
              let obj = null;
              switch (key) {
                case 'male':
                  obj = {
                    title: '男生',
                    gender: 'male',
                    catList: value
                  };
                  break;
                case 'female':
                  obj = {
                    title: '女生',
                    gender: 'female',
                    catList: value
                  };
                  break;
                case 'press':
                  obj = {
                    title: '出版',
                    gender: 'press',
                    catList: value
                  };
                  break;
                default:
                  break;
              }
              if (obj !== null) {
                this.categories.push(obj);
              }
            }
            this.$nextTick(function () {
              loading.closeLoding();
            })
          })
      }
    }
  }
</script>

<style scoped>

</style>
