<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <bread-crumb title1="商品管理" title2="分类参数"></bread-crumb>
    <!-- 提示信息 -->
    <el-alert
      class="alert"
      title="注意:只允许为第三级分类设置参数"
      type="warning"
      left
      show-icon
      :closable="false"
    ></el-alert>
    <el-row>
      <el-col :span="24" class="col">
        <span>请选择商品分类</span>
        <!--  级联选择selectedOptions装的是data里面的value 当selectedOptions和value一样 显示label值
         value	指定选项的值为选项对象的某个属性值
        label	指定选项标签为选项对象的某个属性值-->
        <el-cascader
          :options="options"
          v-model="selectedOptions"
          :show-all-levels="false"
          :props="props"
          expand-trigger="hover"
          @change="handleChange"
        ></el-cascader>
        <!-- <el-tabs v-model="activeName">
          <el-tab-pane label="动态参数" name="many">
            <el-button :disabled="isDisabled" type="primary" size="mini">设置动态参数</el-button>
            <el-table :data="dynamicParams" style="width: 100%">
              <el-table-column type="expand" width="40">
                <template slot-scope="scope">
                  <el-tag closable :disable-transitions="false" @close="handleClose"></el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  ></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="index" label="#" width="40"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primany" icon="el-icon-edit" plain></el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="only">
            <el-button :disabled="isDisabled" type="primary" size="mini">设置静态参数</el-button>
            <el-table :data="staticParams" style="width: 100%">
              <el-table-column type="expand" width="40">
                <template slot-scope="scope"></template>
              </el-table-column>
              <el-table-column prop="index" label="#" width="40"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
              <el-table-column prop="attr_vals" label="属性值" width="180"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primany" icon="el-icon-edit" plain></el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>-->
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      props: {
        label: "cat_name",
        value: "cat_id"
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
      //更改级联选择
      handleChange(){

      },
    async getData() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请选择三级分类");
        return;
      }
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`
      );
      const {
        data,
        meta: { status, msg }
      } = res.data;
      console.log(res)
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
.col {
  margin-top: 16px;
  margin-bottom: 20px;
  font-size: 14px;
}
</style>
