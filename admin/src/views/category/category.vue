<template>
  <section class="category-list p-5">
    <el-row class="mt-10 px-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="分类名称">
          <el-select v-model="formInline.name" placeholder="请选择父级分类">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="p in parents"
              :key="p._id"
              :label="p.name"
              :value="p.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类级别">
          <el-select v-model="formInline.level" placeholder="分类级别">
            <el-option label="全部" value=""></el-option>
            <el-option label="普通分类" value="普通分类"></el-option>
            <el-option label="一级分类" value="一级分类"></el-option>
            <el-option label="二级分类" value="二级分类"></el-option>
            <el-option label="三级分类" value="三级分类"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryCategory">查询</el-button>
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
          prop="level"
          sortable=""
          label="分类级别"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="name"
          label="分类名称"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="parent.name"
          label="父级分类"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="bookCount"
          label="数目"
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
        <el-form-item label="父级分类" prop="parent">
          <el-select v-model="dialogForm.parent._id" placeholder="请选择父级分类" class="w-100">
            <el-option
              v-for="p in parents"
              :key="p._id"
              :label="p.name"
              :value="p._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数目" prop="bookCount">
          <el-input v-model="dialogForm.bookCount"></el-input>
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
    data() {
      return {
        formInline: {
          name: "",
          level: "",
          parent: ""
        },
        tableData: [],
        multipleSelection: [],
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogStatus: "create",
        dialogVisible: false,
        dialogForm: {
          _id: "",
          name: "",
          parent: [],
          bookCount: 0
        },
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
          ],
          parent: [
            {required: true, message: '请选择父分类', trigger: 'change'}
          ],
          bookCount: [
            {required: true, message: '请输入数目', trigger: 'blur'},
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
    created() {
      this.fetchData();
      this.onSearch();
    },
    methods: {
      async fetchData() {
        const res = await this.$http.get("/rest/categories");
        this.parents = res;
      },
      handleEdit(index, row) {
        this.dialogVisible = true;
        this.dialogForm = Object.assign({}, row);
        this.dialogForm.parent==null?this.dialogForm.parent={_id:""}:this.dialogForm.parent;
        console.log(this.dialogForm, row);
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate();
        });
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val;
        this.onSearch();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageNum=val;
        this.onSearch();

      },
      queryCategory(){
        this.pageNum=1;
        this.onSearch();
      },
      async onSearch() {
        const res=await this.$http.post("/book/categories/pagination",{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          level:this.formInline.level,
          name:this.formInline.name
        });
        this.tableData = res.data;
        this.total=res.count;
        console.log("onSearch",res);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
          this.dialogVisible = false;
        });
      },
      resetForm(formName) {
        this.dialogVisible = false;
      }
    }
  }
</script>

<style scoped>

</style>
