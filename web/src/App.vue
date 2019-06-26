<template>
  <div id="app" class="unlogin-page bg-lowergrey">
    <router-view/>
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
