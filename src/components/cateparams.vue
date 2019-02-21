<template>
    <el-card class="box">
        <cus-bread level="商品管理" level2='商品列表'></cus-bread>
        <el-alert title="注意:只允许为第三级分类设置参数" type="warning" show-icon class="alert"></el-alert>
        <el-form class="form" label-position="left" label-width="120px" :model="fmData">
            <el-form-item label="请选择商品分类">
                <el-cascader expand-trigger="hover" :options="options" v-model="selectedval" @change="handleChange" :props="defaultProp">
                </el-cascader>
            </el-form-item>
        </el-form>

        <el-tabs v-model="active" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="1">
                <el-button disabled>设置动态参数</el-button>
                <el-table :data="arrty" border stripe style="width: 100%">
                    <el-table-column type="expand" width="140">
                        <template slot-scope="scope">
                            <el-tag :key="i" v-for="(attr,i) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row,attr)">
                                {{attr}}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                        </template>
                    </el-table-column>

                    <el-table-column type="index" label="#" width="120">
                    </el-table-column>

                    <el-table-column prop="attr_name" label="属性名称" width="240">
                    </el-table-column>

                    <el-table-column label="操作" width="300">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="2">
                <el-button disabled>设置静态参数</el-button>
                <el-table :data="arrStatic" border stripe style="width: 100%">

                    <el-table-column type="index" label="#" width="120">
                    </el-table-column>

                    <el-table-column prop="attr_name" label="属性名称" width="240">
                    </el-table-column>
                     <el-table-column prop="attr_vals" label="属性值" width="240">
                    </el-table-column>

                    <el-table-column label="操作" width="300">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            options: [],
            // selectedval:[]当选中某个label时，这个label的value会自动添加到这个数组中
            selectedval: [],
            defaultProp: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            active: '1',
            arrty: [],
            arrStatic:[],
            fmData: {},

            dynamicTags: ['标签一', '标签二', '标签三'],
            inputVisible: false,
            inputValue: ''
        }
    },
    created() {
        this.getGooddata()
    },
    methods: {

        handleClick() {
            this.getDyStaticData()
        },
        // 级联选择器选中时
        handleChange() {
            this.getDyStaticData()
        },
        // 获取三级分类数据
        async getGooddata() {
            const res = await this.$http.get(`categories?type=3`)
            // console.log(res)
            const { meta: { msg, status }, data } = res.data
            if (status === 200) {
                this.options = data;
            }
        },

        // 获取动态或静态参数
        async getDyStaticData() {
            if (this.active === '1' || this.active === '2') {
                if (this.selectedval.length === !3) {
                    this.$message.error('请选择三级分类');
                    return

                }

                // 获取动态参数
                if (this.active === '1') {
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
                if (this.active === '2') {
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


        async handleClose(item, attr) {
            item.attr_vals.splice(item.attr_vals.indexOf(attr), 1);

            // 发送请求
            const res = await this.$http.put(`categories/${this.selectedval[2]}/attributes/${item.attr_id}`, {
                attr_name: item.attr_name,
                attr_sel: "many",
                attr_vals: item.attr_vals.join(",")
            })
            // console.log(res)
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        async handleInputConfirm(item) {
            let inputValue = this.inputValue;
            if (inputValue) {
                item.attr_vals.push(inputValue);

                const res = await this.$http.put(`categories/${this.selectedval[2]}/attributes/${item.attr_id}`, {
                    attr_name: item.attr_name,
                    attr_sel: "many",
                    attr_vals: item.attr_vals.join(",")

                })
                // console.log(res)
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
