<template>
  <section class="chapter">
    <van-popup
      v-model="popShow"
      position="right"
      :style="{ width: chapterWidth }"
      v-on:closed="$emit('hide-menu')"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
      >
        <van-cell-group v-if="isFromMenu">
          <van-cell class="bg-red-i text-white-i">
            <span slot="title">返回</span>
            <svg-icon class="mt-1" slot="icon" icon-class="left-arrow" @click="$emit('hide-menu')"></svg-icon>
          </van-cell>
        </van-cell-group>
        <van-cell-group>
          <van-cell>
            <span slot="title">共{{chapters.length}}章</span>
            <span slot="default" @click="reverseChapters">{{sort?'正序':'倒序'}}</span>
          </van-cell>
        </van-cell-group>
        <van-cell-group title="正文卷">
          <van-cell
            v-for="chapter in chapters"
            :key="chapter.id"
            @click="selectChapter(chapter.id)"
            :class="[{'text-red-i':chapter.id === curBook.readContent}]"
          >
            <span slot="title">{{chapter.title}}</span>
            <svg-icon v-if="chapter.isVip" slot="right-icon" icon-class="red-lock" class="mt-1"></svg-icon>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-popup>
  </section>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "Chapter",
    props: {
      chapters: {type: Array, required: true},
      show: {type: Boolean, required: true, default: false},
      chapterWidth:{type:String,required:true,default: "80%"},
      isFromMenu:{type: Boolean, required: true, default: false}
    },
    data(){
      return{
        finished:true,
        loading:false,
        popShow:false,
        sort:true,
      }
    },
    watch:{
      show:function () {
        this.popShow=this.show;
      }
    },
    created() {
      this.popShow=this.show;
    },
    computed: {
      ...mapState([
        'curBook'
      ])
    },
    methods: {
      reverseChapters: function () {
        console.log("reserve");
        this.sort = !this.sort;
        this.chapters.reverse();
      },
      selectChapter: function (chapterId) {
        this.$emit('select-chapter', chapterId);
        console.log("chapterCurbook",this.curBook);
      }
    }
  }
</script>

<style scoped>

</style>
