<template>
  <div class="assets-con" v-cloak>
    <group class="list-modal">
      <div class="withdraw-modal">
        <div class="left">
          <h3>可提现金额</h3>
          <p>￥0.00</p>
        </div>
        <div class="right" @click="withDraw">提现</div>
      </div>
      <cell title="不可用金额" link="">￥0.00
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-cube"></i>-->
      </cell>
    </group>
    <group class="list-modal bottom">
      <cell title="已结算收入" link="">￥0.00
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>-->
      </cell>
      <cell title="未结算收入" link="">￥0.00
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-money"></i>-->
      </cell>
    </group>
    <group class="list-modal bottom">
      <cell title="收支明细" link="/income_list">
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-table"></i>-->
      </cell>
      <cell title="提现记录" link="/with_draw_list">
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-file-text-o"></i>-->
      </cell>
    </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Grid, GridItem, Group, Cell} from 'vux'
  import {assetsApi} from '../../service/main.js'

  export default {
    name: 'assets-con',
    data() {
      return {
        isPosting: false,
        onFetching: false,
        noMore: false,
        assets: {}
      }
    },
    components: {Grid, GridItem, Group, Cell},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getAssets()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'assets') {
          vm.getAssets()
        }
      }
    },
    /*computed: {},*/
    methods: {
      getAssets(){
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(assetsApi.asset, null, 'POST', function (res) {
          vm.onFetching = false
          vm.processing(0, 1)
          vm.assets = res.data
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      withDraw(){
        if (vm.assets.currentAmount > 0) {
          vm.jump('with_draw')
        } else {
          vm.toast('当前无可提现金额', 'warn')
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .assets-con {
    overflow-x: hidden;
    .list-modal {
      .weui-cells {
        margin-top: 10/@rem;
        padding: 0;
      }
      .weui-cell {
        padding: 24/@rem !important;
        .fz(26) !important;
      }
      .withdraw-modal {
        .rel;
        padding: 80/@rem 24/@rem !important;
        .cf;
        background: #FE6246 url(../../../static/img/sw_d.png) no-repeat 96% bottom;
        .rbg-size(32%);
        .left {
          .borBox;
          width: 100%;
          padding-right: 100/@rem;
          h3 {
            .txt-normal;
            .fz(30)
          }
          p {
            padding-top: 40/@rem;
            .fz(50) !important;
          }
        }
        .right {
          .abs-center-vertical;
          right: 24/@rem;
          padding-right: 12px;
          .fz(28);
          &:after {
            content: " ";
            display: inline-block;
            height: 6px;
            width: 6px;
            border-width: 2px 2px 0 0;
            border-color: #fff;
            border-style: solid;
            -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            position: absolute;
            top: 50%;
            margin-top: -6px;
            right: 2px;
          }
        }
      }
      &.bottom {
        margin-top: 10/@rem;
      }
    }
  }

</style>
