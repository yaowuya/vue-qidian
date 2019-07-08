<template>
  <section class="category-list p-5">
    <el-row class="mt-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="审批人">
          <el-input v-model="formInline.user" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="formInline.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="400"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          min-width="55">
        </el-table-column>
        <el-table-column
          fixed
          prop="_id"
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
          prop="parent.name"
          label="父级分类"
          min-width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="100">
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
    <el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
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
          user: '',
          region: ''
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
        currentPage4: 4
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        const res = await this.$http.get("/rest/categories");
        this.tableData = res;
        this.parents = res;
      },
      handleEdit(index, row) {
        this.dialogVisible = true;
        // for (let key in row) {
        //   this.$set(this.dialogForm,key,row[key]);
        // };
        this.dialogForm=Object.assign({}, row);

        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate();
        });
        console.log(this.dialogForm,row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      onSubmit() {
        console.log('submit!');
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
