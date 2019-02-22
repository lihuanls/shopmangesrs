<template>
    <el-card class="box">
        <cus-bread level="数据统计" level2="数据报表"></cus-bread>
        <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
</template>

<script>
import MyEcharts from "echarts";
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.initEcharts()
    },
    methods: {
        async initEcharts() {
            const myChart = MyEcharts.init(document.getElementById('main'));

            const res = await this.$http.get(`reports/type/1`);
            const option1 = res.data.data

            const option2 = {
                title: {
                    text: '堆叠区域图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                 
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
            };

            const option = {...option1,...option2}
            myChart.setOption(option);
        }
    }

}
</script>

<style>
</style>
