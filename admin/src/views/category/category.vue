<template>
  <section class="category-list p-5">
    <el-row class="mt-10 px-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="分类名称">
          <el-input v-model="formInline.name" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryCategory">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="addCategory">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="400"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: '_id', order: 'ascending'}"
      >
        <el-table-column
          type="selection"
          min-width="55">
        </el-table-column>
        <el-table-column
          fixed
          prop="_id"
          sortable
          label="ObjectId"
          min-width="240">
        </el-table-column>
        <el-table-column
          prop="name"
          label="分类名称"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="bookCount"
          label="数目"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="url"
          label="分类链接"
          min-width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      width="50%"
      center
    >
      <el-form :model="dialogForm" :rules="rules" ref="ruleForm" label-position="left" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="数目" prop="bookCount">
          <el-input v-model="dialogForm.bookCount"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="bookCount">
          <el-input v-model="dialogForm.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'categoryList',
    data () {
      return {
        formInline: {
          name: '',
          level: '',
          parent: ''
        },
        tableData: [],
        multipleSelection: [],
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogStatus: 'create',
        dialogVisible: false,
        dialogForm: {
          name: '',
          bookCount: 0,
          url:""
        },
        dialogId:null,
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
          bookCount: [
            { required: true, message: '请输入数目', trigger: 'blur' },
          ]
        },
        parents: [],
        pageNum: 1,
        pageSize: 10,
        pageSizeList: [10, 20, 50, 100, 200],
        pageCount: 11,
        total: 0
      }
    },
    created () {
      this.fetchData()
      this.onSearch()
    },
    methods: {
      async fetchData () {
        const res = await this.$http.get('/rest/categories')
        this.parents = res
      },
      handleEdit (index, row) {
        this.dialogVisible = true
        this.dialogStatus = 'update'
        this.dialogId=row._id
        this.dialogForm = Object.assign({}, row)
        console.log(this.dialogForm, row)
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      handleDelete (index, row) {
        this.$confirm(`是否确定要删除分类 "${row.name}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`/rest/categories/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.onSearch()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.onSearch()
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.pageNum = val
        this.onSearch()

      },
      queryCategory () {
        this.pageNum = 1
        this.onSearch()
      },
      addCategory () {
        this.dialogVisible = true
        this.dialogStatus = 'create'
        this.dialogId=null
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      async onSearch () {
        const res = await this.$http.post('/book/categories/pagination', {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.formInline.name
        })
        this.tableData = res.data
        this.total = res.count
        console.log('onSearch', res)
      },
      submitForm (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let res = null
            if (this.dialogId) {
              res = await this.$http.put(`/rest/categories/${this.dialogId}`, this.dialogForm)
            } else {
              res = await this.$http.post('/rest/categories', this.dialogForm)
            }
            console.log(res)
          } else {
            this.$message({
              type: 'error',
              message: '请输入完整信息'
            })
            return false
          }
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.dialogVisible = false
          this.onSearch()
        })
      },
      resetForm (formName) {
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
