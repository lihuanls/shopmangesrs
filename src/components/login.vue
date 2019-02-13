<template>
    <div class='login-wrap'>
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
           <h2>用户登录</h2>
          <el-form-item label="用户名">
           <el-input v-model="formData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
           <el-input v-model="formData.password"></el-input>
          </el-form-item>
          <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登录</el-button>
       </el-form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
      // async,await简化代码，将异步操作看着像同步
    async handleLogin() {
      const res = await this.$http.post("login", this.formData)
      const { data: { data:{token}, meta: { msg, status } } } = res
      if (status === 200) {
          // 永久保存数据‘token’
        localStorage.setItem('token',token)
        this.$router.push({
            name:'home'
        })
      } else {
          // 提示框组件
        this.$message.error(msg)
      }
    }
  }
};

// this.$http.post('login',this.formData)
//             .then(res=> {
//                 // console.log(res)
//                 const {data:{data,meta:{msg,status}}} = res
// if (status === 200) {
//   console.log(msg);
// } else {
//   this.$message.error(msg);
// }

//             })
</script>
  
<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 400px;
  background: #fff;
  border-radius: 5px;
  padding: 20px;
}
.login-btn {
  width: 100%;
}
</style>
