<template>
  <div class="assets-con" v-cloak>
    <group class="list-modal">
      <div class="withdraw-modal">
        <div class="left">
          <h3>可提现金额</h3>
          <p>￥182066.00</p>
        </div>
        <div class="right">提现</div>
      </div>
      <cell title="不可用金额" link="">￥1000
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-cube"></i>
      </cell>
    </group>
    <group class="list-modal bottom">
      <cell title="已结算收入" link="">￥8200
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>
      </cell>
      <cell title="未结算收入" link="">￥1000
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-money"></i>
      </cell>
    </group>
    <group class="list-modal bottom">
      <cell title="收支明细" link="">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-table"></i>
      </cell>
      <cell title="提现记录" link="">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-file-text-o"></i>
      </cell>
    </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Grid, GridItem, Group, Cell} from 'vux'

  export default {
    name: 'assets-con',
    data() {
      return {
        sellerName: '水一波旗舰店',
        count: 0
      }
    },
    components: {Grid, GridItem, Group, Cell},
    beforeMount() {
      me = window.me
    },
    mounted() {
      // me.attachClick()
    },
    /*watch: {
      '$route'(to, from) {
      }
    },*/
    computed: {},
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      jumpTo(pathName, param, type) {
        /* [type=2] 1:'path'2:'name',3:'query' */
        type = type || 'name'
        if (pathName) {
          if (type === 1) {
            this.$router.push({path: '/' + pathName + (param ? '/' + param : '')})
          }
          if (type === 2) {
            this.$router.push({name: pathName, params: param || ''})
          }
          if (type === 3) {
            this.$router.push({path: '/' + pathName, query: param || ''})
          }
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
        /*.bdiy(#FE6246);*/
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
            position: relative;
            top: -2px;
            position: absolute;
            top: 50%;
            margin-top: -4px;
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
