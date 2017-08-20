<template>
  <div class="statistic-con">
    <tab class="statistic-tab" active-color="#f34c18">
      <tab-item selected @on-item-click="onItemClick(0)">近7天</tab-item>
      <tab-item @on-item-click="onItemClick(1)">30天</tab-item>
      <tab-item @on-item-click="onItemClick(2)">半年</tab-item>
    </tab>
    <div class="echarts">
      <IEcharts :option="bar" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
      <button @click="doRandom">生成</button>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import IEcharts from 'vue-echarts-v3/src/full.vue';
  import {Tab, TabItem} from 'vux'
  import {statisticApi} from '../../service/main.js'

  export default {
    name: 'statistic-con',
    data() {
      return {
        sellerId: null,
        value: '',
        results: [],
        statistic: [],
        isPosting: false,
        onFetching: false,
        loading: true,
        datas: [
//          ['0点', '6点', '12点', '18点', '24点'],
          ['周一', '周二', '周三', '周四', '周五'],
          ['1号', '15号', '30号'],
          ['1月', '2月', '3月', '4月', '5月']
        ],
        bar: {
          width: 250,
          title: {
            text: '近7天数据'
          },
          tooltip: {},
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五']
//            data: ['Shirt', 'Sweater', 'Chiffon Shirt', 'Pants', 'High Heels', 'Socks']
          },
          yAxis: {},
          series: [{
            name: 'Sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    },
    components: {IEcharts, Tab, TabItem},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.params.sellerId = vm.$store.state.global.sellerId
      vm.getStatistic()
    },
    computed: {},
    methods: {
      onItemClick(type) {
        vm.getStatistic(type)
        vm.bar.xAxis.data = vm.datas[type]
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      getStatistic(type) {
        vm.loading = false
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(statisticApi.list, {id: vm.sellerId, type: type}, 'POST', function (res) {
          var resD = res.data.itemList
          vm.statistic = resD
          console.log(vm.statistic, '统计数据')
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

  .echarts {
    width: 400px;
    height: 400px;
  }

  .statistic-con {
    .rel;
    height: 100%;
  }
</style>
