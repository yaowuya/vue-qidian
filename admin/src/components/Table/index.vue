<template>
  <section class="table p-5">
    <el-row>
      <el-table
        :data="tableData"
        empty-text="暂无数据"
        border
        style="width: 100%"
        :max-height="tableHeight"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: '_id', order: 'ascending'}"
        :cell-style="{whiteSpace:'nowrap',textOverflow:'ellipsis'}"
      >
        <template v-for="(col,index) in tableCols">
          <!-- 操作列/自定义列 -->
          <slot v-if="col.slot" :name="col.slot"></slot>
          <el-table-column v-else
                           :key="index"
                           :prop="col.prop"
                           :label="col.label"
                           :width="col.width"
                           :sortable="col.sortable"
                           :fixed="col.fixed"
                           :formatter="col.formatter"
                           :align="col.align"
                           :show-overflow-tooltip="col.tip"
          >
          </el-table-column>
        </template>
      </el-table>
    </el-row>
    <el-row class="mt-10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        :pager-count="pageCount"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="f-right"
      >
      </el-pagination>
    </el-row>
  </section>
</template>
<!--
show-overflow-tooltip:当内容超过列宽时，使用省略号，并且有tooltip提示框。如果不使用，内容会自动撑开行高。
-->
<script>
  export default {
    name: 'Table',
    props: {
      tableHeight: { type: Number, default: () => {return 450} },
      tableData: { type: Array, default: () => {return []} },
      columns: { type: Array, required: true, default: () => {return []} },
      pageNum: { type: Number, default: () => {return 1} },
      pageSize: { type: Number, default: () => {return 10} },
      pageSizeList: { type: Array, default: () => {return [10, 20, 50, 100, 200]} },
      pageCount: { type: Number, default: () => {return 11} },
      total: { type: Number, default: () => {return 0} },
    },
    data () {
      return {
        tableCols: [],
        colObj: {
          slot: false,
          prop: '',
          label: '',
          width: '120',
          sortable: false,
          fixed: false,
          align: 'center',
          tip:true
        },
        multipleSelection: [],
      }
    },
    created () {
      this.initCols()
    },
    methods: {
      initCols () {
        for (let col of this.columns) {
          this.tableCols.push({ ...this.colObj, ...col })
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(val)
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`, this.pageNum, this.pageSize)
        this.$emit('search', this.pageNum, val)
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`, this.pageNum, this.pageSize)
        this.$emit('search', val, this.pageSize)
      },
    }
  }
</script>

<style scoped>
</style>
