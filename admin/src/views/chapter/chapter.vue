<template>
  <section class="chapter">
    <el-row class="mt-10 px-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="章节名称">
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
    <Table
      :table-data="tableData"
      :columns="columns"
      :page-num="pageNum"
      :page-size="pageSize"
      :total="total"
      @search="search"
    >
      <el-table-column
        slot="selection"
        type="selection"
        min-width="55">
      </el-table-column>
      <el-table-column
        slot="operate"
        fixed="right"
        label="操作"
        min-width="200"
        align="center">
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
    </Table>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      width="50%"
      center
    >
      <el-form :model="dialogForm" :rules="rules" ref="ruleForm" label-position="left" label-width="100px">
        <el-form-item label="章节名称" prop="name">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="书名" prop="book">
          <el-select v-model="dialogForm.book" placeholder="placeholder" class="w-100">
            <el-option
              v-for="item in books"
              :key="item._id"
              :label="item.title"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="章节URL" prop="url">
          <el-input v-model="dialogForm.url"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="order">
          <el-input v-model="dialogForm.order"></el-input>
        </el-form-item>
        <el-form-item label="章节内容" prop="content">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="dialogForm.content"></el-input>
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
  import Table from '../../components/Table'

  export default {
    name: 'chapter',
    components: {
      Table
    },
    data () {
      return {
        tableData: [],
        columns: [],
        formInline: {
          name: '',
        },
        books: [],
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogStatus: 'create',
        dialogVisible: false,
        dialogForm: {
          name: '',
          book: '',
          url: '',
          order: '',
          content: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
          book: [
            { required: true, message: '请选择书名', trigger: 'change' },
          ]
        },
        dialogId: null,
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },
    created () {
      this.initCol()
      this.onSearch()
      this.fetchBooks()
    },
    methods: {
      initCol () {
        this.columns = [
          { slot: 'selection' },
          { label: 'ObjectId', prop: '_id', width: '210', sortable: true, fixed: true },
          { label: '章节名称', prop: 'name', width: '200' },
          { label: '书名', prop: 'book.title', width: '120' },
          { label: '章节URL', prop: 'url', width: '150' },
          { label: '章节排序', prop: 'order', width: '100' },
          { label: '章节内容', prop: 'content', width: '240' },
          { slot: 'operate' },
        ]
      },
      search (pageNum, pageSize) {
        this.pageNum = pageNum
        this.pageSize = pageSize
        this.onSearch()
      },
      async onSearch () {
        const res = await this.$http.post('/book/chapter/page/chapter', {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.formInline.name,
          sort: { 'book': 1, 'order': 1 }
        })
        this.tableData = res.data
        this.total = res.count
        console.log('onSearch', res)
      },
      async fetchBooks () {
        const res = await this.$http.get('/rest/book')
        this.books = res
      },
      addCategory () {
        this.dialogVisible = true
        this.dialogStatus = 'create'
        this.dialogId = null
        this.empty('ruleForm')
      },
      queryCategory () {
        this.pageNum = 1
        this.onSearch()
      },
      handleEdit (index, row) {
        this.dialogVisible = true
        this.dialogStatus = 'update'
        this.dialogId = row._id
        this.empty()
        this.$nextTick(() => {
          this.dialogForm = Object.assign({}, row)
          this.dialogForm.book = row.book._id
          console.log(this.dialogForm, row)
        })
      },
      handleDelete (index, row) {
        this.$confirm(`是否确定要删除分类 "${row.name}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`/rest/chapter/${row._id}`)
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
      empty (form) {
        if (this.$refs[form]) {
          //根据需求二选一
          /**
           * 移除校验结果并重置字段值
           * 注：清除表单项name的校验及数值
           */
          this.$refs[form].resetFields()
          /**
           * 移除校验结果
           * 注：只清除表单项name的校验，不清楚表单项name的数值
           */
          this.$refs[form].clearValidate()
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let res = null
            if (this.dialogId) {
              res = await this.$http.put(`/rest/book/${this.dialogId}`, this.dialogForm)
            } else {
              res = await this.$http.post('/rest/book', this.dialogForm)
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
        this.empty(formName)
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
