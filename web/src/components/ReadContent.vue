<template>
  <section class="read-content">
    <div class="page-read">

    </div>
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
      return {
        isAdded: false,
        isShowOpt: false,
        isShowSet: false,
        skinBgList: ['skin-default', 'skin-blue', 'skin-green', 'skin-pink', 'skin-dark', 'skin-light']
      }
    },
    created() {
      this.isAdded = this.curBook.isInShelf;
      if (!this.skinBgList.includes(this.skinColor)) {
        this.SET_SKIN_COLOR('skin-default');
      }
    },
    methods:{
      ...mapMutations([
        'SET_NIGHT_MODE',
        'SET_SKIN_COLOR',
        'SET_FONT_SIZE',
        'SET_CUR_BOOK',
        'ADD_TO_SHELF'
      ]),
    }
  }
</script>

<style scoped lang="scss">

</style>
