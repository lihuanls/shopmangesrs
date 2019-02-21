<template>
    <el-card class="box">
        <cus-bread level="商品管理" level2='商品列表'></cus-bread>
        <el-row class="searchbox">
            <el-col>
                <el-button @click="addGoodsCate()" type="success">添加分类</el-button>
            </el-col>
        </el-row>

        <el-table :data="list" style="width: 100%" height="450">
            <el-tree-grid prop="cat_name" treeKey='cat_id' parentKey='cat_pid' levelKey='cat_level' childKey='children' label="商品分类" width="140"></el-tree-grid>
            <el-table-column label="级别" width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level===0">一级</span>
                    <span v-if="scope.row.cat_level===1">二级</span>
                    <span v-if="scope.row.cat_level===2">三级</span>
                </template>
            </el-table-column>
            <el-table-column label="是否有效" width="140">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_deleted===false">有效</span>
                    <span v-if="scope.row.cat_deleted===true">无效</span>
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

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

        <!-- 对话框 -->
        <el-dialog title="添加分类 " :visible.sync="dialogFormVisibleAdd">
            <el-form :model="fmdata" label-width="140px">
                <el-form-item label="分类名称">
                    <el-input v-model="fmdata.cat_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-cascader expand-trigger="hover" :options="catlist" v-model="selectedval" @change="handleChange" :props="defaultProp" clearable>
                    </el-cascader>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addCat()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
// var ElTreeGrid = require('element-tree-grid');
import ElTreeGrid from 'element-tree-grid'
export default {
    components: {
        ElTreeGrid
    },
    data() {
        return {
            list: [],
            pagenum: 1,
            pagesize: 2,
            total: -1,
            dialogFormVisibleAdd: false,
            fmdata: {
                cat_pid: 0,
                cat_name: "",
                cat_level: -1
            },
            // options: [],
            catlist: [],
            // selectedval:[]当选中某个label时，这个label的value会自动添加到这个数组中
            selectedval: [],
            defaultProp: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },

        }
    },
    created() {
        this.getGoodCate()
    },
    methods: {
        async addCat() {
            // 如果没选择分类 -> 添加一级分类
            if (this.selectedval.length === 0) {
                this.fmdata.cat_pid = 0
                this.fmdata.cat_level = 0
            }
            // 如果选了一个分类 -> 添加的是二级分类
            if (this.selectedval.length === 1) {
                this.fmdata.cat_pid = this.selectedval[0]
                this.fmdata.cat_level = 1
            }
            // 如果选了两个分类,->添加三级分类
            if (this.selectedval.length === 2) {
                this.fmdata.cat_pid = this.selectedval[1];
                this.fmdata.cat_level = 2;
            }

            const res = await this.$http.post(`categories`, this.fmdata)
            console.log(res)
            const {
                meta: { msg, status }
            } = res.data;
            if (status === 201) {
                this. dialogFormVisibleAdd = false
                this.getGoodCate();
            }
        },
        async addGoodsCate() {
            const res = await this.$http.get(`categories?type=2`)
            this.catlist = res.data.data
            this.dialogFormVisibleAdd = true
        },
        handleChange() { },
        // 获取所有商品分类
        async getGoodCate() {
            const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            this.list = res.data.data.result
            console.log(this.list)
            this.total = res.data.data.total
        },

        // 分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.getGoodCate()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pagenum = val
            this.getGoodCate()
        },
    }

}
</script>

<style>
.box {
  height: 100%;
}
.searchbox {
  margin-top: 20px;
}
</style>
