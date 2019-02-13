<template>
 <el-container class="container">
  <el-header>
    <el-row>
       <el-col :span="5"><img src="@/assets/logo.png" alt="图片加载失败"></el-col>
       <el-col :span="18" class="middle"><h2>电商后台管理系统</h2></el-col>
       <el-col :span="1"><div class="grid-content bg-purple"><a href="#" class="logout">退出</a></div></el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside class="aside" width="200px">Aside</el-aside>
    <el-main class="main">Main</el-main>
  </el-container>
 </el-container>
</template>

<script>
export default {};
</script>

<style>
.container {
  background-color: #eee;
  height: 100%;
}
.aside {
  background-color: #ccc;
}
.main {
  background-color: #333;
}
.middle{
    line-height: 60px;
    text-align: center;
}
.logout{
    line-height: 60px;
    text-decoration: none;
}
</style>
