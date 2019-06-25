<template>
  <van-nav-bar
    :title="title"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
  />
</template>

<script>
  export default {
    name: "HeaderBar",
    props: {
      title: {type: String, required: true}
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>

</style>
