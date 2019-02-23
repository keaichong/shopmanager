<template>
  <div class="login-wrap">
    <el-form
      status-icon
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formdata"
      ref="formdata"
    >
      <h2>用户登录</h2>
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[
      { required: true, message: '用户名不能为空', trigger: 'blur'}]"
      >
        <el-input autofocus v-model="formdata.username" ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[
      { required: true, message: '密码不能为空', trigger: 'blur'},]"
      >
      <!-- 数字类型的验证需要在 v-model 处加上 .number 的修饰符，这是 Vue 自身提供的用于将绑定值转化为 number 类型的修饰符。 -->
        <el-input v-model="formdata.password" type="password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登陆</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  // methods: {
  //   handleLogin () {
  //     this.$http
  //       .post(`login`, this.formdata)
  //       .then(res => {
  //         // console.log(res)
  //         const {
  //           data: {
  //             // data,
  //             meta: { msg, status }
  //           }
  //         } = res
  //         if (status === 200) {
  //           this.$router.push({
  //             // name: 'home'
  //             path: '/'
  //           })
  //         } else {
  //           // element-ui插件的提示框
  //           this.$message.error(msg)
  //           this.formdata.username = ''
  //           this.formdata.password = ''
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err)
  //       })
  //   }
  // }
  methods: {
    // 目前代码: 异步操作的结果必须出现.then方法的里面-> 嵌套
    // 希望: 不想在函数嵌套里面处理res
    // 需要使用ES7的新特性: async await
    async handleLogin() {
      // res 接收异步操作结果
      const res = await this.$http.post(`login`, this.formdata);
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      // console.log(res);
      
      if (status === 200) {
        // 把正确的用户的token保存起来
        // 存值(有三种方式)   html5新增
        localStorage.setItem("token", data.token);
        // 取值(有三种方式)
        // const aa = localStorage.getItem("tokenID");
        // console.log(aa);
        this.$router.push({
          name: "home"
        });
      } else {
        // element-ui插件的提示框
        this.$message.error(msg);
        this.formdata.username = "";
        this.formdata.password = "";
      }
    }
  }
};
</script>

<style scoped>
.login-wrap {
  /* 注意: 百分比布局 父元素height:100% */
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #ffffff;
  border-radius: 5px;
  width: 400px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
