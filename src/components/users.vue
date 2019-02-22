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
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeState(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="showDiaEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDiaDeleUser(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
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
    <!-- 对话框 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata">
        <el-form-item label="用户名" :label-width="formLabelWidth">{{formdata.username}}</el-form-item>

        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="selectVal" placeholder="请选择角色">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <!-- v-for循环生成后台返回的角色 -->
            <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
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
      pagesize: 2,
      total: -1,
      //添加按钮 对话框默认显示状态
      dialogFormVisibleAdd: false,
      //  编辑按钮 默认状态
      dialogFormVisibleEdit: false,
      //   分配角色 对话框
      dialogFormVisibleRole: false,
      //    分配角色 对话框宽度
      formLabelWidth: "80px",
      //   下拉框的数据 用于选中默认option
      selectVal: -1,
      //    角色数组
      roles: [],
      // 表单数据-> 将来发送post请求->请求体->
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  // 获取首屏数据的方法调用(在这里面调用发放时候已经设置了头部令牌,所以后续请求可以不用在设置头部)
  created() {
    this.getTableData();
  },
  // 组建内守卫
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'users') {
        const answer = window.alert(
      "当前页面没有保存"
    );
      next();
    } else {
      next(false);
    }
  },
  methods: {
    //   分配角色 接口 确定发送请求 进行角色修改
    async setRole() {
      const res = await this.$http.put(`users/${this.formdata.id}/role`, {
        rid: this.selectVal
      });
      //   console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //关闭
        this.dialogFormVisibleRole = false;
      }
    },
    //   分配角色 打开对话框
    async showDiaSetRole(user) {
      //给formadata 赋值 发送分配角色请求需要用户id
      this.formdata = user;
      //   打开对话框
      this.dialogFormVisibleRole = true;
      //获取数据 put
      this.formdata.username = user.username;
      //   获取角色列表 进行下拉框展示
      const res = await this.$http.get(`roles`);
      this.roles = res.data.data;
      // 给下拉框v-model绑定的selectVal赋值 (根据用户id查询用户的角色)
      const res2 = await this.$http.get(`users/${user.id}`);
      this.selectVal = res2.data.data.rid;
      //当用户没有分配角色 返回rid是-1 所以select :value="-1"
      //   console.log(res2); // {id: 523, rid: -1, username: "song123", mobile: "123123213213", email: "123213@为"}
    },
    //  编辑对话框发送请求
    // this.formdata上一步已经展示对话框已经获取user
    // 问题: 双向绑定会导致用户在更改编辑input对话框内容之后又点取消 视图层还是显示更改的数据
    // 解决: 给取消注册事件
    // 取消编辑
    cancelEdit() {
      this.dialogFormVisibleEdit = false;
      // 刷新表格
      this.getTableData();
    },
    // 编辑 发送请求
    async editUser() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭
        this.dialogFormVisibleEdit = false;
        // 更新表格
        this.getTableData();
      }
    },
    //   打开编辑对话框
    showDiaEditUser(user) {
      this.formdata = user;
      this.dialogFormVisibleEdit = true;
    },
    //   打开用户删除对话框(传入当前用户信息)
    showDiaDeleUser(user) {
      this.$confirm("是否删掉用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //用户点击确定删除进入
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          //点击取消
          this.$message.info("取消删除");
        });
    },
    //   修改用户状态 开关(决定用户是否有权限进行登陆)
    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      //  响应值 是0或1 1是true 0 是false
    },

    //   表格状态
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
      this.dialogFormVisibleAdd = true;
    },
    //增加用户
    async addUser() {
      const res = await this.$http.post("users", this.formdata);
      //   console.log(res)
      const data = res.data;
      const {
        meta: { status, msg }
      } = data;
      if (status === 201) {
        // 添加成功
        // 隐藏对话框
        this.dialogFormVisibleAdd = false;
        // 提示成功
        this.$message.success(msg);
        // 重新加载数据
        this.getTableData();
        // 清空文本输入框的值
        for (const key in this.formdata) {
          this.formdata[key] = "";
        }
      } else {
        this.$message.error(msg);
      }
    },
    // 每页条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    // 显示当前页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    // 展示用户
    async getTableData() {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
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
 