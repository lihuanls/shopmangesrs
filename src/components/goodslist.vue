<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level="商品管理" level2='商品列表'></cus-bread>

        <!-- 搜索框 -->
        <el-row class="searchbox">
            <el-col>
                <el-input @clear="clearsearchuser()" placeholder="请输入内容" v-model="query" class="searchinput" clearable>
                    <el-button @click.prevent="searchuser()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button @click.prevent="showGoodsAdd()" type="primary">添加商品</el-button>
            </el-col>
        </el-row>

        <!-- 表格部分 -->
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" >
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)" width="100">
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量" width="80">
            </el-table-column>
            <el-table-column label="创建日期" width="100">
                <template slot-scope="scope">
                    {{scope.row.add_time | fmData}}
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
            list: []
        }
    },
    created() {
        this.getlist()
    },
    methods: {
        // 渲染添加商品组件
        showGoodsAdd() {
            this.$router.push({
                name:'goodsAdd'
            })
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

            const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            console.log(res) 
            const { data, meta: { msg, status } } = res.data
            if (status === 200) {
                this.total = data.total
                // console.log(this.total)
                this.list = data.goods
            }
        }
    }

}
</script>

<style>
.box {
  height: 100%;
}
.searchinput {
  width: 400px;
  margin-top: 20px;
}
</style>
