<template>
  <div class="draw-con" v-cloak>
    <label class="tips"><i class="fa fa-smile-o"></i>&nbsp;当前可提现金额￥{{assets.waitTakeAmount}}元<span
      @click="showPop=true"><i class="fa fa-question-circle-o"></i>&nbsp;提现须知</span></label>
    <group>
      <cell title="金额(元)：" primary="content">
        <x-input placeholder="请输入提现金额" required text-align="right" type="number" v-model.number="params.amount"
                 @on-change="changeAmount"></x-input>
      </cell>
    </group>
    <div class="btn btn-save" @click="draw"><i class="fa fa-credit-card"></i>&nbsp;提交</div>

    <!--提现须知-->
    <div v-transfer-dom>
      <popup class="pop-txtcon" v-model="showPop" position="bottom" max-height="100%">
        <group class="pop-content">
          <h3>提现须知</h3>
          <ul class="txt-list">
            <li>1. 账户余额满100元方可提现，每次提现最小金额100元，提现申请时间不限；</li>
            <li>2. 提现由友你生活代第三方平台收取1%的提现手续费，如果配送点当月微信支付订单数达到50单，马上到公司将给予全额补贴，于次月1日全额返还到配送点的现金账户；</li>
            <li>3.
              提现到账时限说明：工作日上午12点以前提交的提现申请当天下午17:00之前到账，工作日12:00以后提交的提现申请，在第二天下午17:00之前到账（如遇第二天是节假日，顺延到节假日后第一个工作日）。如果是非工作日提交的提现申请，都在申请之后第一个工作日下午17:00之前到账；
            </li>
            <li>4. 第一次提现时，请准确填写自己常用的银行卡账号。首次提现成功后，以后每次提现都会默认自动转账到第一次提现的账号。如果需要临时变更账号，请向友你生活客服提交申请。友你生活客服微信。</li>
          </ul>
        </group>
        <button type="button" class="btn btn-sure" @click="showPop=false">知道了</button>
      </popup>
    </div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Group, Cell, XInput, XTextarea, Popup,TransferDom} from 'vux'
  import {assetsApi} from '../../../service/main.js'

  export default {
    name: 'draw-con',
    directives: {
      TransferDom
    },
    data() {
      return {
        isPosting: false,
        onFetching: false,
        noMore: false,
        showPop: true,
        assets: {},
        params: {
          amount: 0
        }
      }
    },
    components: {Group, Cell, XInput, XTextarea, Popup},
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
          vm.getAvaliDraw()
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
            vm.onFetching = false
            vm.processing(0, 1)
            vm.assets = res.data
          }, function () {
            vm.onFecthing = false
            vm.processing(0, 1)
          }
        )
      },
      draw() {
        if (!vm.params.amount) {
          vm.toast('请输入提现金额', 'warn')
          return false
        }
        if (vm.params.amount > vm.assets.waitTakeAmount) {
          vm.toast('最多可提现' + vm.assets.waitTakeAmount + '元', 'warn')
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
      },
      changeAmount(val) {
        if (val && val > vm.assets.waitTakeAmount) {
          vm.toast('最多可提现' + vm.assets.waitTakeAmount + '元', 'warn')
        }
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
    overflow: hidden;
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
      span {
        .cdiy(#f36b18);
        .fr;
        i {
          .cdiy(#f36b18);
        }
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
      .abs;
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

  .pop-txtcon {
    .vux-no-group-title {
      margin-top: 0;
      padding: 20/@rem 0 40/@rem;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        input {
          .c3;
          &:disabled {
            .c3;
          }
        }
      }
      .vux-x-input, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }

    .pop-content {
      .rel;
      height: 100%;
      .borBox;
      padding: 14/@rem 14/@rem 150/@rem;
      h3 {
        .fz(30);
        font-weight: normal;
        .center;
        .c3;
      }
      ul {
        padding: 14/@rem;
        overflow: hidden;
      }
      li {
        margin: 8/@rem;
        line-height: 1.8;
        font-size: 24/@rem;
        .c3;
      }
    }
    .btn-sure {
      .fix;
      bottom: 0;
      width: 100%;
      padding: 30/@rem 0;
      .fz(26);
      .cf;
      .bdiy(@c1);
    }
  }
</style>
