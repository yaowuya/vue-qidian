<template>
  <section class="dashboard">
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <div class="dashboard-container">
          <div class="dashboard-text">name: {{ name }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start">
      <el-col :span="2">
        <el-button type="primary" @click="addCate">同步分类</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success">成功按钮</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data(){
    return{

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods:{
    addCate(){

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
