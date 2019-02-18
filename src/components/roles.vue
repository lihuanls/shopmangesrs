<template>
    <el-card class="box">
        <cus-bread level="权限管理" level2='角色列表'></cus-bread>
        <el-button class="btn" type="primary">添加角色</el-button>

        <!-- 表格部分 -->
        <el-table :data="roles" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 一级权限 -->
                    <el-row v-for="(item1,i) in scope.row.children" :key="item1.id" class="level1">
                        <el-col :span="4">
                            <el-tag @close="deleteRights(scope.row,item1)" type='danger' closable>{{item1.authName}}</el-tag>
                        </el-col>
                        <el-col :span="20">
                            <!-- 二级权限 -->
                            <el-row v-for="(item2,i) in item1.children" :key="item2.id" class="level2">
                                <el-col :span="4">
                                    <el-tag @close="deleteRights(scope.row,item2)" type="success" closable>{{item2.authName}}</el-tag>
                                </el-col>
                                <!-- 三级权限 -->
                                <el-col :span="20">
                                    <el-tag @close="deleteRights(scope.row,item3)" closable type="warning" v-for="(item3,i) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="scope.row.children.length ===0">
                        <span>未分配权限</span>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="160"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="200">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="200">
            </el-table-column>

            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button @click="showRoleTable(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 对话框 -->
        <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
            <el-tree ref="treedom" :data="treeData" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrchecked" :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setright()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            roles: [],
            dialogFormVisible: false,
            // 树状结构绑定的数据
            treeData: [],
            // 默认展开的数据[被展开的节点ID]
            // arrexpanded:[],
            // 默认选中的数据[被选中的节点ID]
            arrchecked:[],
            // 配置选项
            defaultProps:{
                label:'authName',
                children:'children'
            },
            roleId:'',
        }

    },
    created() {
        this.gettableData()
    },
    methods: {
        // 分配权限功能
        async setright() {
            // 在这里同ref属性操作DOM元素 
            // 获取当前角色选中的节点ID
            const arr1 = this.$refs.treedom.getCheckedKeys()
            // 获取树形结构半选节点ID
            const arr2 = this.$refs.treedom.getHalfCheckedKeys()
            // 合并数组
            const arr = [...arr1,...arr2]

            // 发送请求
            const res = await this.$http.post(`roles/${this.roleId}/rights`,{rids:arr.join(',')})
            if(res.data.meta.status === 200) {
                this.dialogFormVisible = false
                this.gettableData()
            }

        },
        async showRoleTable(role) {
            this.roleId = role.id
            // 获取所有权限
            const res = await this.$http.get(`rights/tree`)
            // console.log(res)
            const {meta:{msg,status},data} =res.data
            if(status === 200) {
                this.treeData = data

                // 获取当前角色的权限  （实现默认选择的功能）
                var temp =[];
                role.children.forEach((item1) => {
                    // temp.push(item1.id)
                    item1.children.forEach((item2) => {
                        // temp.push(item2.id)
                        item2.children.forEach((item3) => {
                            temp.push(item3.id)
                        })
                    })
                })
                this.arrchecked = temp
            }
            this.dialogFormVisible = true
        },
        // 取消权限
        async deleteRights(roles, rights) {
            const res = await this.$http.delete(`roles/${roles.id}/rights/${rights.id}`)
            const { meta: { msg, status }, data } = res.data
            if (status === 200) {
                this.$message.success(msg)
                roles.children = data
            }
        },
        // 获取角色列表
        async gettableData() {
            const res = await this.$http.get(`roles`)
            // console.log(res)
            this.roles = res.data.data
        }
    }

}
</script>

<style>
.btn {
  margin-top: 10px;
}
.level1,
.level2 {
  margin-bottom: 10px;
}
</style>
