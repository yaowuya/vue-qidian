<template>
  <div id="app" class="unlogin-page">
    <router-view :key="$route.path"/>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex';
  export default {
    name: 'app',
    created() {
      this.INIT_STATE();
    },
    methods: {
      ...mapMutations([
        'INIT_STATE'
      ])
    }
  }
</script>

<style lang="scss">
</style>
