<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level="商品管理" level2='商品列表'></cus-bread>
        <el-alert title="添加商品信息" type="info" center show-icon class="alert">
        </el-alert>
        <!-- 步骤条 -->
        <!-- active属性是控制第几步的 -->
        <el-steps :active="active*1" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>

        <!-- 标签页 -->
        <!-- v-model与步骤条中active绑定的数据一样可以实现联动效果 -->
        <el-form class="form" label-position="top" label-width="80px" :model="fmData">
            <el-tabs tab-position="left" v-model="active" @tab-click="changTab()">
                <el-tab-pane label="基本信息" name="1">
                    <el-form-item label="商品名称">
                        <el-input v-model="fmData.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="fmData.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="fmData.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="fmData.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-cascader expand-trigger="hover" :options="options" v-model="selectedval" @change="handleChange" :props="defaultProp">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="2">
                    <el-form-item v-for="(item1,i) in arrty" :key="item1.attr_id" :label="item1.attr_name">
                        <el-checkbox-group v-model="item1.attr_vals">
                            <el-checkbox v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2" border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="3">
                    <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="4">
                    <el-form-item label="添加图片">
                        <el-upload :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture" action="http://localhost:8888/api/private/v1/upload" :headers="headers">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="5">
                    <el-form-item>
                        <el-button @click="addGoods()">添加商品</el-button>
                        <quill-editor v-model="fmData.goods_introduce" class="quill"></quill-editor>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
    components: {
        quillEditor
    },
    data() {
        return {
            active: '-1',
            fmData: {
                goods_name: "",
                goods_cat: "",
                goods_price: "",
                goods_number: "",
                goods_weight: "",
                goods_introduce: "",
                pics: [],
                attrs: []
            },
            options: [],
            // selectedval:[]当选中某个label时，这个label的value会自动添加到这个数组中
            selectedval: [1, 3, 6],
            defaultProp: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            // 动态参数数据
            arrty: [],
            // 静态参数数据
            arrStatic: [],
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }
    },
    created() {
        this.getGooddata()
    },
    methods: {
        async addGoods() {
            // 处理数据
            this.fmData.goods_cat = this.selectedval.join(',')
            const arr1 = this.arrty.map(item => {
                return { attr_id: item.attr_id, attr_value: item.attr_vals }
            })
            const arr2 = this.arrStatic.map(item => {
                return { attr_id: item.attr_id, attr_value: item.attr_vals }
            })
            this.fmData.attrs = [...arr1, ...arr2]
            // 发送请求
            const res = await this.$http.post(`goods`, this.fmData)
            // console.log(res)
            const {
                meta: { msg, status }
            } = res.data;
            if(status === 201) {
                this.$router.push({
                    name:'goods'
                })
            }else{
                this.$message.error(msg)
            }
        },
        handleRemove(file, fileList) {
            // console.log(file);
            // const tmPath = data.tmp_path
            const index = this.fmData.pics.findIndex(item => {
                return item.pic === file.response.data.tmp_path
            })
            this.fmData.pics.split(index, 1)
        },
        handleSuccess(response, file, fileList) {
            // console.log(response);

            this.fmData.pics.push({
                pic: response.data.tmp_path
            })
        },
        // 处理商品参数
        async changTab() {

            if (this.active === '2' || this.active === '3') {
                if (this.selectedval.length === !3) {
                    this.$message.error('请选择三级分类');
                    return

                }

                // 获取动态参数
                if (this.active === '2') {
                    const res = await this.$http.get(`categories/${this.selectedval[2]}/attributes?sel=many`)
                    // console.log(res)
                    const { meta: { msg, status }, data } = res.data
                    if (status === 200) {
                        this.arrty = data;
                        this.arrty.forEach(item => {
                            item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',')
                        });
                        console.log(this.arrty)

                    }

                }

                // 获取静态参数
                if (this.active === '3') {
                    const res = await this.$http.get(`categories/${this.selectedval[2]}/attributes?sel=only`)
                    // console.log(res)
                    const { meta: { msg, status }, data } = res.data
                    if (status === 200) {
                        this.arrStatic = data;
                        // console.log(this.arrStatic)

                    }
                }

            }

        },
        // 获取商品数据
        async getGooddata() {
            const res = await this.$http.get(`categories?type=3`)
            // console.log(res)
            const { meta: { msg, status }, data } = res.data
            if (status === 200) {
                this.options = data;
            }
        },
        handleChange() { }
    }

}
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  height: 400px;
  overflow: auto;
}
</style>
