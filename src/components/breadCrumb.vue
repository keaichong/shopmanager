<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <!-- {{level}}差值表达式 -->
    <el-breadcrumb-item>{{title1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{title2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  // data(){
  //     return {
  //         level1:
  //         level2:
  //     }
  // }
//   组件的名字应该有组件自己
  name: "breadCrumb",
  // 前提:data中的数据特点:值只能来源于本身
  // 1. 数据的声明的值如果来源于外部, 此时数据声明不能写在data中
  // 2. 应该把数据声明写在选项props
  // 3. props的值可以是字符串数组
  // 4. props中的数据level1和2用法和data用法一样 -
  // 5. props中的数据是数据的声明
  // 6. props中的数据将来就是组件的属性->也就是自定义标签的属性 <abc level1=?></abc>
  // 7. props中的数据将来使用组件时通过属性进行赋值<abc level1="权限列表"></abc>

  props: ["title1", "title2",]
};
</script>

<style>
</style>
