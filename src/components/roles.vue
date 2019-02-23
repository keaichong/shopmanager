<template>
  <el-card class="box">
    <bread-crumb title1="权限管理" title2="角色列表"></bread-crumb>
    <el-button class="btn" type="primary">添加角色</el-button>
    <!-- 表格 -->
    <el-table height="500px" :data="roles" style="width: 100%" @expand-change="fn">
      <!-- expand 设置一个可以展开的按钮 -->
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <!-- 循环展示五行 -->
          <el-row class="level1" v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="deleRights(scope.row,item1)"
              >{{item1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="error"
                    @close="deleRights(scope.row,item2)"
                  >{{item2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    @close="deleRights(scope.row,item3)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button
            @click="showDiaSetRights(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogFormVisible: false,
      currRoleId: -1,
      arrCheck: [],
      treelist: [],
      defaultProps: {
        label: "authName",
        children: "children"
      }
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    fn(row, expandedRows) {
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },
    // 分配权限-确定按钮 发送请求
    async setRights() {
      //获取选中的节点发送请求进行数据修改
      // 获取全选节点id element-ui文档 -> 方法 getCheckedKeys
      const arr1 = this.$refs.tree.getCheckedKeys();
      // 获取半选节点id element-ui文档 -> getHalfCheckedKeys
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      const arr = [...arr1, ...arr2];
      //   console.log(arr);
      //   arr.join(",");
      //   console.log(arr);
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.dialogFormVisible = false;
        this.getRoles();
      }
    },

    //展示分配权限对话框 roles 角色列表第一层为角色信息 第二层开始为权限说明，权限一共有 3 层权限 role是当前角色第二层
    async showDiaSetRights(role) {
      //打开对话框时候保存当前角色id 用于之后发送修改权限请求
      this.currRoleId = role.id;
      // 获取数据
      const res = await this.$http.get(`rights/tree`);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        //显示树状列表
        this.treelist = data;
        //给对应角色列表选中已有的权限
        const temp2 = [];
        role.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            item2.children.forEach(item3 => {
              temp2.push(item3.id);
            });
          });
        });
        this.arrCheck = temp2;
      }
      this.dialogFormVisible = true;
    },
    //
    //删除权限
    async deleRights(roles, rights) {
      const res = await this.$http.delete(
        `roles/${roles.id}/rights/${rights.id}`
      );
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        // 提示
        this.$message.success(msg);
        // 更新
        // this.getRoles();
        // 响应会返回当前角色的剩余权限
        // 只更新当前的角色权限
        roles.children = data;
      }
    },
    //表格展示权限列表
    async getRoles() {
      const res = await this.$http.get(`roles`);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
    }
  }
};
</script>

<style scoped>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
.level2 {
  margin-bottom: 10px;
}
</style>
