<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <bread-crumb title1="商品管理" title2="商品列表"></bread-crumb>
    <!-- 搜索框 -->
    <el-row class="seartBox">
      <el-col>
        <el-input
          @clear="getAllUsers()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="searchInput"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchGoods()"></el-button>
        </el-input>
        <!-- 添加按钮  $router  是路由的实例化对象 -->
        <el-button type="success" @click="$router.push({name:'goodsadd'})">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table class="table" height="500px" :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="700"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.add_time | fmtdate}}</template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="showDiaEditGoods(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDiaDeleGoods(scope.row)"
            type="danger"
            icon="el-icon-delete"
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 编辑 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="商品名称">
          <el-input v-model="formdata.goods_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="formdata.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="formdata.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="formdata.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editGoods()">确 定</el-button>
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
      total: -1,
      //默认页码和展示条数
      pagenum: 1,
      pagesize: 10,
      dialogFormVisibleEdit: false,
      formdata: {
        goods_id: "",
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //取消编辑
    cancelEdit() {
      this.dialogFormVisibleEdit = false;
       // 刷新表格
      this.getTableData();
    },
    // 发送编辑请求
    async editGoods(){
       const res = await this.$http.put(
        `goods/${this.formdata.goods_id}`,
        this.formdata
      );
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      console.log(res);//要设置所属分类
       if (status === 200) {
        // 关闭
        this.dialogFormVisibleEdit = false;
        // 更新表格
        this.getTableData();
      }
      
    },
    //展示编辑对话框
    showDiaEditGoods(goods) {
      this.formdata = goods;
      this.dialogFormVisibleEdit = true;
    },
    //点击搜索搜索商品
    searchGoods() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 搜索框清空时候获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    //获取商品数据
    async getTableData() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.goods;
        console.log(data);
        
      }
    },
    //每页条数
    handleSizeChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    //当前页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTableData();
    },
    showDiaDeleGoods(goods) {
      this.$confirm("是否删掉该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // console.log(goods);goods_id
          const res = await this.$http.delete(`goods/${goods.goods_id}`);
          console.log(res);

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
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.searchInput {
  width:350px;
}
.table{
  width: 100%;
}
.seartBox {
  margin-top: 20px;
}
.page {
  margin-top: 20px;
}
</style>
