<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="5"><img src="@/assets/logo.png" alt="图片加载失败"></el-col>
        <el-col :span="18" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <a @click.prevent="handleLoginOut()" href="#" class="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu default-active="1" :router="true" :unique-opened="true">
          <!-- 用户管理 -->
          <el-submenu :index="item1.order+''" v-for="(item1,i) in list" :key="item1.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item1.authName}}</span>
        </template>
          <el-menu-item :index="item2.path+''" v-for="(item2,i) in item1.children" :key="item2.id">
          <i class="el-icon-menu"></i>
          {{item2.authName}}            
          </el-menu-item> 
      </el-submenu>
 
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  // 设置用户登录权限：根据token值监测登录状态：若登录过（有token值）直接渲染home.vue组件，若没有（没有正确的token值）回到login.vue完成登录
  beforeMount() {
    if (!localStorage.getItem("token")) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  created() {
    this.getMenu()
  },
  methods: {
    // 动态生成侧边导航
    async getMenu() {
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      const res = await this.$http.get(`menus`)
        console.log(res)
      console.log(localStorage.getItem("token"))
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.list = data
        // console.log(this.menus)
      }
    },
 
    // 退出功能
    handleLoginOut() {
      // 1.清除token值
      localStorage.clear()
      // 2.跳转到登录页面
      this.$router.push({
        name: 'login'
      });
      // 提示
      this.$message.warning('退出成功')
    }
  }
};
</script>

<style>
.container {
  background-color: #eee;
  height: 100%;
}
.aside {
  /* background-color: #ccc; */
  height: 100%;
}
.main {
  background-color: #333;
}
.middle {
  line-height: 60px;
  text-align: center;
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
</style>
