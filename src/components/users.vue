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
                    <el-switch @change="changeStatus(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click.prevent="showEditTable(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button @click.prevent="showDeleteBox(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button @click="showRoleTable(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

        <!-- 添加功能的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
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
                <el-button type="primary" @click="adduser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑功能 的对话框 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
            <el-form label-position="left" label-width="80px" :model="fmdata">
                <el-form-item label="用户名">
                    <el-input v-model="fmdata.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="fmdata.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="fmdata.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="edituser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="dialogFormVisibleSetRole">
            <el-form :model="fmdata" label-width="80px" label-position="left">
                <el-form-item label="用户名">
                     {{fmdata.username}}
                </el-form-item>
                <el-form-item label="角色" >
                    <el-select v-model="searchval" placeholder="请选择角色名称">
                        <el-option label="请选择" :value="-1"></el-option>
                        <!-- 其他的通过v-for生成 -->
                        <el-option v-for="(item,i) in role" :key ="i" 
                        :label="item.roleName"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleSetRole = false">取 消</el-button>
                <el-button type="primary" @click="setRoal()">确 定</el-button>
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
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            dialogFormVisibleSetRole:false,
            fmdata: {
                username: "",
                password: "",
                email: "",
                mobile: ""
            },
            searchval:-1,
            role:[],
            userid:-1,

        }
    },
    created() {
        this.getlist()
    },
    methods: {
        // 实现分配角色的功能
        async setRoal() {
            const res = await this.$http.put(`users/${this.userid}/role`,{rid:this.searchval})
            console.log(res)
            const {meta:{msg,status}} =res.data
            if(status === 200) {
                this.$message.success(msg)
                this.dialogFormVisibleSetRole = false
            }
        },
        // 分配角色-渲染组件
        async showRoleTable(user) {
            this.dialogFormVisibleSetRole = true
            // 获取角色列表
            const res = await this.$http.get(`roles`)
            const {meta:{msg,status},data} = res.data
            if(status === 200) {
                this.userid = user.id
              this.role = data
                // 显示用户名
                this.fmdata = user

            }
            // 获取当前用户的ID
            const res2 = await this.$http.get(`users/${user.id}`)
            this.searchval = res2.data.data.rid
        },
        // 改变状态
        async changeStatus(user) {
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            const { meta: { msg, status } } = res.data
            if (status === 200) {
                this.$message.success(msg)
            }
        },
        // 实现编辑功能
        async edituser() {
            const res = await this.$http.put(`users/${this.fmdata.id}`, this.fmdata)
            const { meta: { msg, status } } = res.data
            if (status === 200) {
                this.dialogFormVisibleEdit = false
                this.getlist()
            }
        },
        // 编辑功能-渲染编辑组件
        showEditTable(user) {
            this.dialogFormVisibleEdit = true
            // 显示用户信息
            this.fmdata = user
        },
        // 删除功能
        showDeleteBox(user) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.delete(`users/${user.id}`)
                const { meta: { msg, status } } = res.data
                if (status === 200) {
                    // 提示
                    this.$message.success(msg);
                    // 渲染列表
                    this.pagenum = 1
                    this.getlist()

                }
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        // 实现添加功能
        async adduser() {

            const res = await this.$http.post(`users`, this.fmdata)
            const { meta: { msg, status } } = res.data
            if (status === 201) {
                // 关闭对话框
                this.dialogFormVisibleAdd = false
                // 渲染列表
                this.getlist()

            }
        },
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
 
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            // console.log(res) 
            const { data, meta: { msg, status } } = res.data
            if (status === 200) {
                this.total = data.total
                // console.log(this.total)
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
