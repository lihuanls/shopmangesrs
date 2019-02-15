<template>
    <!-- el-card小容器 可以理解为是div -->
    <el-card class="box">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <el-row class="searchbox">
            <el-col>
                <el-input @clear="clearsearchuser()" placeholder="请输入内容" v-model="query" class="searchinput" clearable>
                    <el-button @click.prevent="searchuser()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button @click="showAddTable()" type="primary">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格部分 -->
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="id" label="#" width="80">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="80">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="140">
            </el-table-column>
            <el-table-column label="创建日期" width="160">
                <template slot-scope="scope">
                    {{scope.row.create_time | fmData}}
                </template>
            </el-table-column>
            <el-table-column label="用户状态" width="140">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

        <!-- 添加功能的对话框 -->
        <el-dialog title="收货地址" :visible.sync="dialogFormVisibleAdd">
            <el-form label-position="left" label-width="80px" :model="fmdata">
                <el-form-item label="用户名">
                    <el-input v-model="fmdata.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="fmdata.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="fmdata.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="fmdata.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisibleAdd = false">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            pagenum: 1,
            pagesize: 2,
            total: -1,
            list: [],
            dialogFormVisibleAdd:false,
            fmdata: {
                username: "",
                password: "",
                email: "",
                mobile: ""
            }

        }
    },
    created() {   
        this.getlist()
    },
    methods: {
        // 添加功能-渲染添加组件
        showAddTable() {
          this.dialogFormVisibleAdd = true
        },
        // 清除搜索能容显示列表
        clearsearchuser() {
            this.getlist()
        },
        // 搜索功能
        searchuser() {
            this.pagenum = 1
            this.getlist()
        },
        // 分页功能
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.getlist()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pagenum = val
            this.getlist()
        },
        // 获取表格数据
        async getlist() {
            const AUTH_TOKEN = localStorage.getItem("token")
            this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            // console.log(res) 
            const { data, meta: { msg, status } } = res.data
            if (status === 200) {
                // this.total = data.total
                this.total = data.total
                console.log(this.total)
                this.list = data.users
            }
        }

    }
};
</script>

<style>
.searchbox {
  margin-top: 20px;
}
.searchinput {
  width: 400px;
}
</style>
