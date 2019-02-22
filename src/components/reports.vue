<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <bread-crumb title1="商品管理" title2="商品列表"></bread-crumb>
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    //再mouunted调用 因为要获取dom元素
    this.getcharts();
  },
  methods: {
    async getcharts() {
      const myChart = echarts.init(document.getElementById("main"));
      const res = await this.$http.get(`reports/type/1`);
      console.log(1)
      console.log(res)
      console.log(res.data);
      const option2 = res.data.data;
      const option1 = {
        title: {
          text: "数据报表"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };
      const option = { ...option1, ...option2 };
      //使用图标
      myChart.setOption(option);
    }
  }
};
</script>

<style>
</style>
