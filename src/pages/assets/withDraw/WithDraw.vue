<template>
  <div class="draw-con" v-cloak>
    <label class="tips"><i class="fa fa-smile-o"></i>&nbsp;当前可提现金额￥200.00元</label>
    <group>
      <cell title="金额：" primary="content">
        <x-input placeholder="请输入提现金额" required text-align="right" type="number" v-model="params.amount"></x-input>
      </cell>
    </group>
    <div class="btn btn-save" @click="draw"><i class="fa fa-credit-card"></i>&nbsp;提交</div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Group,Cell,XInput,XTextarea} from 'vux'
  import {assetsApi} from '../../../service/main.js'

  export default {
    name: 'draw-con',
    data() {
      return {
        value: '',
        results: [],
        list: [],
        isPosting: false,
        onFetching: false,
        noMore: false,
        params: {
          amount: 0
        }
      }
    },
    components: {Group, Cell, XInput, XTextarea},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getAvaliDraw()
    },
    /*computed: {},*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'with_draw_list') {
          vm.getDraw()
        }
      }
    },
    methods: {
      getAvaliDraw(isLoadMore) {
        if (vm.onFecthing) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.onFecthing = true
        vm.loadData(assetsApi.asset, vm.params, 'POST', function (res) {
            vm.onFecthing = false
            vm.processing(0, 1)
            var resD = res.data.pager
            if (!isLoadMore) {
              if (resD.totalCount < vm.params.pageSize) {
                vm.noMore = true
              } else {
                vm.noMore = false
              }
              vm.list = resD.itemList
            } else {
              resD.itemList.length ? vm.list.concat(resD.itemList) : vm.noMore = true
            }
            vm.results = vm.list.slice(0)
            console.log(vm.list, '订单数据')
          }, function () {
            vm.onFecthing = false
            vm.processing(0, 1)
          }
        )
      },
      draw(){
        if (!vm.params.amount) {
          vm.toast('请输入提现金额', 'warn')
          return false
        }
        if (vm.isPosting) return false
        vm.processing()
        vm.isPosting = true
        vm.loadData(assetsApi.withDraw, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {
            vm.toast('提现成功')
            vm.$router.back()
          } else {
            vm.toast(res.data || '提现成功')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .draw-con {
    .rel;
    height: 100%;
    .bottom {
      margin-top: 10/@rem;
    }
    .tips {
      display: block;
      padding: 12/@rem 24/@rem;
      .fz(22);
      .c6;
      background: #f9ecc6;
      i {
        .cdiy(#1db314);
      }
    }
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
      }
      .vux-label-desc {
        .fz(24);
        .cdiy(@c2);
      }
      .vux-x-input, .address-area, .vux-selector, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }
    .btn-save {
      .fix;
      bottom: 0;
      z-index: 20;
      width: 100%;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem;
      .center;
      .cf;
      .fz(28);
      .bdiy(@c2);
    }
  }

</style>
