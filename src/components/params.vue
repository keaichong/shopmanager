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

    <el-form :model="form" class="form" label-position="left" label-width="120px">
      <el-form-item label="请选择商品分类">
        <!--  级联选择selectedOptions装的是data里面的value 当selectedOptions和value一样 显示label值
         value	指定选项的值为选项对象的某个属性值
        label	指定选项标签为选项对象的某个属性值
        options就是选项对象-->
        <el-cascader
          :options="options"
          v-model="selectedOptions"
          :show-all-levels="false"
          :props="props"
          expand-trigger="hover"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <!-- tab栏切换 -->
    <el-tabs @tab-click="changeTab()" v-model="actice" type="border-card">
      <el-tab-pane name="1" label="动态参数">
        <el-button>添加动态参数</el-button>
        <!-- type	对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮 -->
        <el-table height="450px" border stripe :data="arrDy" style="width: 100%">
          <el-table-column type="expand" width="120">
            <template slot-scope="scope">
              <!-- 动态tag编辑 -->
              <el-tag
                :key="i"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column type="index" label="#" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称"></el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="2" label="静态参数">
        <el-button>添加静态参数</el-button>
        <el-table height="350px" border stripe :data="arrStatic" style="width: 100%">
          <el-table-column type="index" label="#" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"></el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      actice: "1",
      form: {},
      options: [],
      selectedOptions: [],
      props: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDy: [],
      arrStatic: [],
      //动态编辑标签
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //关闭tags
    async handleClose(obj, item) {
      //从数组中删除这个tags
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);
      //发送请求
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}
        `,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          // 以,分割的属性值列表 [].join(",")
          attr_vals: obj.attr_vals.join(",")
        }
      );
    },

    //input输入框 $nextTick和mounted 类似 mouted不会承诺所有子组件都被加载
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //添加tags
    async handleInputConfirm() {
      const inputValue = this.inputValue;
      //if输入框的值不是''空字符串 进入下面
      if (inputValue) {
        obj.attr_vals.push(inputValue);
        //发送请求 添加动态参数 具体属性值
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}
        `,
          {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: obj.attr_vals.join(",")
          }
        );
      }
    },
    //切换tab
    changeTab() {
      this.getDyOrStatic();
    },
    //更改级联选择
    handleChange() {
      // 显示的label一变化触发的方法
      this.getDyOrStatic();
    },
    // 获取动态or静态数据
    async getDyOrStatic() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请选择三级分类!!");
        if (this.actice === "1") {
          this.arrDy = [];
        }
        if (this.actice === "2") {
          this.arrStatic = [];
        }
        return;
      }
      // 获取动态数组(cpu)
      if (this.actice === "1") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          this.arrDy.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
        }
      }
      //获取静态参数(主体-商品名称)
      if (this.actice === "2") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          this.arrStatic = data;
        }
      }
    },
    // 级联数据加载
    async getData() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    }
  }
};
// 1.进入页面加再级联数据
// 2.选择完级联加载动态
// 3.tab切换加载静态参数
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
