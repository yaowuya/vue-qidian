<template>
  <section class="read-content">

  </section>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';

  export default {
    name: "ReadContent",
    props: {
      readContent: Array
    },
    watch: {
      //当为点击目录进入阅读界面时，滚动条回到顶部
      readContent: function () {
        if (this.readContent.length === 1) {
          document.body.scrollTop = 0;
        }
      }
    },
    computed: {
      ...mapState([
        'curBook',
        'nightMode',
        'skinColor',
        'fontSize'
      ])
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">

</style>
