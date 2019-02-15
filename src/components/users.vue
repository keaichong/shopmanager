 <template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="seartBox">
      <el-col>
        <!-- 搜索框 -->
        <el-input
          @clear="getAllUsers()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="searchInput"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="success" @click="showDiaAddUser()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table height="350px" :data="list" style="width: 100%" :row-class-name="tableRowClassName">
      <!-- create_time: 1486720211
           email: "adsfad@qq.com"
           id: 500
           mg_state: true
           mobile: "12345678"
           role_name: "主管"
      username: "admin"-->
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <!-- <el-table-column prop="create_time" label="创建日期" width="140"></el-table-column>
        fmtdate的使用
      1. v-bind:
      2. {{msg | fmtdate}}
      3
        前提:下面这个单元格的内容不是prop的值create_time的值-日期
        1. 给单元格内容外层加template
        2. 给template设置slot-scope 一般slot-scope值设置为scope
        3. slot-scope的值 会自动绑定外层数据结构,这里是el-table的data的值 list
        4. 在内容位置写scope.row 自动取出数组list中每个对象,其中row是固定写法
      -->
      <el-table-column prop="create_time" label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- ，使用了size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项， -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -添加用户-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
 
 <script>
export default {
  data() {
    return {
      query: "",
      list: [],
      pagenum: 1,
      pagesize: 3,
      total: -1,
     //添加按钮 对话框默认显示状态
      dialogFormVisibleAdd: false,
    // 表单数据-> 将来发送post请求->请求体->
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  // 获取首屏数据的方法调用
  created() {
    this.getTableData();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    // 搜索框清空时候获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    // 搜索用户  当点击按钮会把query的数据放入 url中的query 后台根据query进行模糊查询 重新渲染页面
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 添加用户对话框状态
    showDiaAddUser() {
         this.dialogFormVisibleAdd = true 
    },
    async addUser () {
      this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token')
      const res = await this.$http.post('users', this.formdata)
      console.log(res)
      const data = res.data
      const { meta: { status, msg } } = data
      if (status === 201) {
        // 添加成功
        // 隐藏对话框
       this.dialogFormVisibleAdd = false
        // 提示成功
        this.$message.success(msg)
        // 重新加载数据
        this.getTableData()
        // 清空文本输入框的值
        for (const key in this.formdata) {
          this.formdata[key] = ''
        }
      } else {
        this.$message.error(msg)
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
      }
    }
  }
};
</script>
 
 <style>
.box {
  height: 100%;
}
.searchInput {
  width: 350px;
}
.seartBox {
  margin-top: 20px;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.page {
  margin-top: 20px;
}
</style>
 