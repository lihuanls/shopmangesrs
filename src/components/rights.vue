<template>
    <el-card class="box">
        <cus-bread level='权限管理' level2='权限列表'></cus-bread>
        <el-button class="btn" type="primary">添加角色</el-button>

        <!-- 表格 -->
        <el-table height="450px" :data="list" style="width: 100%">
            <el-table-column type='index' label="#" width="80">
            </el-table-column>
            <el-table-column prop="authName" label="角色名称" width="80">
            </el-table-column>
            <el-table-column prop="path" label="路径" width="180">
            </el-table-column>

            <el-table-column label="层级" width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.level==='0'">一级</span>
                    <span v-if="scope.row.level==='1'">二级</span>
                    <span v-if="scope.row.level==='2'">三级</span>
                </template>
            </el-table-column>

        </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            list: []
        }
    },
    created() {
        this.getlist()
    },
    methods: {
        async getlist() {
 
            const res = await this.$http.get(`rights/list`)
            console.log(res)
            const { meta: { msg, status }, data } = res.data
            if (status === 200) {
                this.list = data
            }
        }
    }

}
</script>

<style>
.btn {
  margin-top: 20px;
}
</style>
