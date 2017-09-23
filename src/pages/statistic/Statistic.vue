<template>
  <div class="statistic-con" v-cloak>
    <button-tab class="btn-tab-con" v-model="curType">
      <button-tab-item selected>订单量</button-tab-item>
      <button-tab-item>销售量</button-tab-item>
      <button-tab-item>浏览量</button-tab-item>
    </button-tab>
    <!--<tab class="statistic-tab" active-color="#f34c18">
      <tab-item selected @on-item-click="onItemClick(0)">近7天</tab-item>
      <tab-item @on-item-click="onItemClick(1)">30天</tab-item>
      <tab-item @on-item-click="onItemClick(2)">半年</tab-item>
    </tab>-->
    <div class="echarts">
      <div id="myChart" :style="{width: '100%', height: '250px'}"></div>
      <!--<IEcharts ref="myChart" :option="bar" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>-->
      <!--<button @click="doRandom">生成</button>-->
    </div>
    <div class="bottom-col">

    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import IEcharts from 'vue-echarts-v3/src/full.vue'
  import echarts from 'echarts'
  import {Tab, TabItem, ButtonTab, ButtonTabItem, Divider} from 'vux'
  import {statisticApi} from '../../service/main.js'

  export default {
    name: 'statistic-con',
    data() {
      return {
        seller: null,
        value: '',
        curType: 0,
        results: [],
        statistic: [],
        isPosting: false,
        onFetching: false,
        loading: true,
        datas: [
//          ['0点', '6点', '12点', '18点', '24点'],
          ['周一', '周二', '周三', '周四', '周五'],
          ['1号', '6号', '12号', '28号', '30号'],
          ['1月', '2月', '3月', '4月', '5月']
        ],
        bar: {
          width: 320,
          title: {
            text: ''
          },
          tooltip: {},
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五']
          },
          // color:'yellow',
          yAxis: {},
          series: [{
            name: 'Sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10]
          }]
        },
        colors: ['#5793f3', '#d14a61', '#675bba'],
        option: {}
      }
    },
    components: {IEcharts, Tab, TabItem, ButtonTab, ButtonTabItem, Divider},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.seller = vm.$store.state.global.userInfo || (me.sessions.get('ynSellerInfo') ? JSON.parse(me.sessions.get('ynSellerInfo')) : {})
      vm.getOrderData()
      vm.getSaleData()
      vm.getPuvData()
//      var myChart = vm.$refs.myChart
//      window.onresize = function () {
//        myChart.resize();
//      }
      var myChart = echarts.init(document.getElementById('myChart'));
      myChart.setOption({
        color: vm.colors,

        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['PV', 'UV']
        },
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: vm.colors[1]
              }
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return '浏览量  ' + params.value
                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                }
              }
            },
            data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: vm.colors[0]
              }
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return '浏览量  ' + params.value
                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                }
              }
            },
            data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '2015 浏览量',
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '2016 浏览量',
            type: 'line',
            smooth: true,
            data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
          }
        ]
      })
    },
    /*computed: {},*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'statistic') {
          vm.getOrderData()
          vm.getSaleData()
          vm.getPuvData()
        }
      }
    },
    methods: {
      onItemClick(type) {
        vm.getOrderData(type)
        vm.bar.xAxis.data = vm.datas[type]
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      getOrderData(type) {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(statisticApi.orderAnalysis, {sellerId: vm.seller.id, days: 7}, 'POST', function (res) {
          var resD = res.data.itemList
          vm.statistic = resD
          console.log(vm.statistic, '销售情况统计数据')
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      getSaleData(type) {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(statisticApi.saleAnalysis, {sellerId: vm.seller.id, days: 7}, 'POST', function (res) {
          var resD = res.data.itemList
          vm.statistic = resD
          console.log(vm.statistic, '销售情况统计数据')
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      getPuvData(type) {
        vm.loading = false
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(statisticApi.puvAnalysis, {sellerId: vm.seller.id, days: 7}, 'POST', function (res) {
          var resD = res.data.itemList
          vm.statistic = resD
          console.log(vm.statistic, '店铺流量统计数据')
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      delOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.delOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      doRandom() {
        const that = this;
        let data = [];
        for (let i = 0, min = 5, max = 99; i < 6; i++) {
          data.push(Math.floor(Math.random() * (max + 1 - min) + min));
        }
        that.loading = !that.loading;
        that.bar.series[0].data = data;
      },
      onReady(instance) {
        console.log(instance);
      },
      onClick(event, instance, echarts) {
        console.log(arguments);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .statistic-con {
    .rel;
    height: 100%;
    overflow-x: hidden;
    .echarts {
      width: 400px;
      height: 400px;
    }
    .vux-button-group{
      a.vux-button-group-current{
        background: #e2951c;
      }
    }
    .btn-tab-con{
      .borBox;
      padding:20/@rem;
    }
  }
</style>
