<template>
  <el-card class="box">
    <bread-crumb :title1="title" title2="权限列表"></bread-crumb>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      title:"权限管理"
    };
  },
  //权限列表展示
  created() {
 this.getTableData();
  },
  methods: {
    async getTableData() {
      const res = await this.$http.get(`rights/list`);
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  },
};
</script>

<style>
.box {
  height: 100%;
}
</style>
