<template>
  <el-card class="box">
    <bread-crumb :title1="title" title2="权限列表"></bread-crumb>
    <!-- 表格 -->
    <el-table height="500px" :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="120"></el-table-column>
      <el-table-column prop="path" label="路径" width="140"></el-table-column>
      <el-table-column label="层级" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      title: "权限管理"
    };
  },
  //权限列表展示
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const res = await this.$http.get(`rights/list`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data;
        // console.log(data);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>
