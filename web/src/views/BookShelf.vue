<template>
  <div class="pa w-100 h-100 d-flex jc-center ai-center">
    <van-icon class="icon-body fs-18 mr-1 text-gray" class-prefix="my-icon" name="read"/>
  </div>
</template>

<script>
  export default {
    name: 'BookShelf'
  }
</script>

<style scoped>
  .pa {
    position: absolute;
  }

  .icon-body {
    font-size: 76px;
    color: #b4b8be;
    cursor: pointer;
  }
</style>
