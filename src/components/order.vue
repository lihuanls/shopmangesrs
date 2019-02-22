<template>
    <el-card class="box">
        <cus-bread level="订单管理" level2="订单列表"></cus-bread>

        <el-table :data="list" style="width: 100%">
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="300">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="100">
            </el-table-column>
            <el-table-column label="是否付款" width="140">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
                    <el-tag type='danger' v-if="scope.row.order_pay==='1'">未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop='is_send' label="是否发货" width="160">
            </el-table-column>
            <el-table-column label="下单时间" width="160">
                <template slot-scope="scope">
                    {{scope.row.create_time | fmData}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" @click="showEditdia(scope.row)" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog title="修改订单地址" :visible.sync="dialogFormVisibleEdit">
            <el-form label-width="120px" :model="fmdata">
                <el-form-item label="省市区">
                   <el-cascader expand-trigger="hover" :options="catlist" v-model="selectedval" @change="handleChange" :props="defaultProp" clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="fmdata.email" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import Catlist from "@/assets/city_data2017_element.js";
export default {
    data() {
        return {
            list: [],
            dialogFormVisibleEdit:false,
            fmdata:{},
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
        this.getorderData()
    },
    methods: {
        showEditdia(item) {
           this.dialogFormVisibleEdit = true
           this.catlist = Catlist
        },
        handleChange() { },
        async getorderData() {
            const res = await this.$http.get(`orders?pagenum=1&pagesize=10`)
            // console.log(res)
            this.list = res.data.data.goods
        }
    }

}
</script>

<style>
.box {
  height: 100%;
}
</style>
