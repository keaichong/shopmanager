<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <bread-crumb title1="商品管理" title2="商品列表"></bread-crumb>
    <el-alert class="alert" title="添加商品信息" type="warning" center show-icon :closable="false"></el-alert>
    <el-steps :active="active*1" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 tab切换 -->
    <el-form :model="form" class="form" label-width="80px" label-position="top">
      <el-tabs v-model="active" @tab-click="changeTab()" tab-position="left">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 表单元素 级联选择 当selectedOptions和value一样 显示label值 -->
            <!--   expand-trigger菜单触发方式 clearable菜单内容可以一键清空 -->
            <el-cascader
              :props="propsParams"
              clearable
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品参数" name="2">
          <el-form-item v-for="item in arrDy" :key="item.attr_id" :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals">
              <!-- 此处遍历的 item.attr_vals 不是一个数组 是一个字符串 要处理 -->
              <el-checkbox border v-for="(item1,i) in item.attr_vals" :key="i" :label="item1"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4 ">
          <el-form-item>
            <el-upload
              :headers="headers"
              action="http://localhost:8888/api/private/v1/upload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <!-- 富文本 -->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
            
            <el-button @click="addGoods()">添加商品</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      fileList: [],
      // 默认1
      active: "1",
      form: {},
      options: [],
      // selectedOptions 和 value值  一样 会默认展示
      selectedOptions: [1, 3, 6],
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //  文档 props 是一个object :参数 value label children disables
      propsParams: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 动态参数数组
      // attr_id: 3077
      // attr_name: "版式"
      // attr_sel: "many"
      // attr_vals: "aa,bb,cc,ee"
      // attr_write: "list"
      // cat_id: 6
      // delete_time: null
      arrDy: [],
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    //   进入页面的时候就渲染好商品数据列表
    this.getGoodsCate();
  },
  methods: {
    //添加商品 提交表单
    //以','分割的分类列表
    async addGoods() {
      this.form.goods_cat = this.selectedOptions.join(",");

      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      //   attrs	商品的参数（数组）
      this.form.attrs = [...arr1, ...arr2];

      const res = await this.$http.post(`goods`, this.form);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 201) {
        // 提示
        this.$message.success(msg);
        // 回到列表
        this.$router.push({
          name: "goods"
        });
      } else {
        this.$message.warning(msg);
      }
    },
    // 图片上传方法
    handleRemove(file, fileList) {
      // 删除图片 从数组中
      const Index = this.form.pics.findIndex(item => {
        //如果遍历数组图片的临时路径=>当item这一项图片临时路径等于移除图片的该路径
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(Index, 1);
    },
    handleSuccess(response, file, fileList) {
      console.log(response);
      //      this.form.pics.push({
      pic: response.data.tmp_path;
      //   });
    },
    //点击tab时候触发
    async changeTab() {
      // 获取静态参数数据
      if (this.active === "3" && this.selectedOptions.length !== 3) {
        this.arrStatic = [];
        this.$message.error("请选择三级分类");
      } else {
        //   不判断->  点击active2也会触发
        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const {
            meta: { msg, status },
            data
          } = res.data;
          console.log(res);
          if (status === 200) {
            this.arrStatic = data;
          }
        }
      }
      // 获取动态参数数据
      if (this.active === "2" && this.selectedOptions.length !== 3) {
        this.arrDy = [];
        this.$message.error("请选择三级分类");
      } else {
        if (this.active === "2") {
          // 获取当前商品动态参数数据 就是三级分类中最后一个是具体商品(海信,夏普,tcl)的分类id  所以this.selectedOptions[2]是具体商品分类id
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );

          const {
            meta: { msg, status },
            data
          } = res.data;
          console.log(res);

          if (status == 200) {
            // this.arrDy(数组对象)中的attr_vals是字符串
            this.arrDy = data;
            this.arrDy.forEach(item => {
              // attr_vals字符串可能出现的几种形式
              // 1. '  1,2,3,   '  前后有空格
              // 2. ' '  空字符串
              item.attr_vals =
                item.attr_vals.trim().length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });
          }
        }
      }
    },

    // 商品数据列表 -商品级联选择
    async getGoodsCate() {
      // 获取三级分类
      const res = await this.$http.get(`categories?type=3`);

      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  margin-top: 20px;
  height: 400px;
  overflow: auto;
}
/* 富文本编辑器css样式  层叠 */
.ql-editor,
.ql-blank {
  min-height: 170px;
}
</style>
