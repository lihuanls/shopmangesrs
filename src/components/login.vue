<template>
    <div class='login-wrap'>
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
          <el-form-item label="用户名">
           <el-input v-model="formData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
           <el-input v-model="formData.password"></el-input>
          </el-form-item>
          <el-button class="login-btn" type="primary">登录</el-button>
       </el-form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            formData:{
                username:'',
                password:'',
            }
        }
    }

}
</script>

<style>

</style>
