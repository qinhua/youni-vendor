<template>
  <div class="guarantee-fee-con" v-cloak>
    <label class="tips"><i class="fa fa-smile-o"></i>&nbsp;买家可在店铺详情看到您设置的押金数量</label>
    <group>
      <cell title="押金：" primary="content">
        <x-input placeholder="请输入押金（元/桶）" required text-align="right" type="number" v-model="guarantee"
                 @on-focus="onFocus"></x-input>
      </cell>
    </group>
    <div class="btn btn-save" @click="update"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {
    Group,
    Cell,
    XInput
  } from 'vux'
  import {userApi} from '../../../service/main.js'

  export default {
    name: 'guarantee-fee',
    data() {
      return {
        isPosting: false,
        sellerId: null,
        guarantee: null
      }
    },
    components: {
      Group,
      Cell,
      XInput
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getSeller()
    },
    methods: {
      getSeller() {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(userApi.get, null, 'POST', function (res) {
          vm.isPosting = false
          if (res.success && res.data) {
            var resD = res.data
            vm.sellerId = resD.id
            vm.guarantee = res.data.mortgage
          }
        }, function () {
          vm.isPosting = false
        })
      },
      onFocus(val){
        // console.log(val)
      },
      validate() {
        if (vm.guarantee === null || vm.guarantee === '') {
          vm.toast('请输入押金！')
          return false
        }
        return true
      },
      update() {
        if (vm.isPosting) return false
        if (vm.validate()) {
          vm.isPosting = true
          vm.processing()
          vm.loadData(userApi.update, {id: vm.sellerId, mortgage: vm.guarantee}, 'POST', function (res) {
            vm.isPosting = false
            vm.processing(0, 1)
            if (res.success) {
              vm.toast('押金设置成功！')
              vm.$router.back()
            } else {
              vm.toast('设置失败！')
            }
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          }, true)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .guarantee-fee-con {
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
