<template>
  <div class="dispatch-time-con" v-cloak>
    <label class="tips"><i class="fa fa-smile-o"></i>&nbsp;将展示在店铺列表和详情中(单位：分钟)</label>
    <group>
      <cell title="派送时长：" primary="content">
        <datetime format="mm" minute-row v-model="label"></datetime>
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
    XInput,
    Datetime
  } from 'vux'
  import {userApi} from '../../../service/main.js'

  export default {
    name: 'dispatch_time',
    data() {
      return {
        isPosting: false,
        sellerId: null,
        label: ''
      }
    },
    components: {
      Group,
      Cell,
      XInput,
      Datetime
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
            vm.label = res.data.label
          }
        }, function () {
          vm.isPosting = false
        })
      },
      validate() {
        if (!vm.label) {
          vm.toast('请输入时长！')
          return false
        }
        return true
      },
      update() {
        if (vm.isPosting) return false
        if (vm.validate()) {
          vm.isPosting = true
          vm.processing()
          vm.loadData(userApi.update, {id: vm.sellerId, label: vm.label}, 'POST', function (res) {
            vm.isPosting = false
            vm.processing(0, 1)
            if (res.success) {
              vm.toast('设置成功！')
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

  .dispatch-time-con {
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
      .vux-x-input,.vux-datetime {
        padding: 24/@rem 0 24/@rem 30/@rem;
      }
      .vux-label-desc {
        .fz(24);
        .cdiy(@c2);
      }
      .vux-x-input{
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
