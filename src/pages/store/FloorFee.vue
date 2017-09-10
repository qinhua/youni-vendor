<template>
  <div class="floor-fee-con" v-cloak>
    <group>
      <!--<popup-picker title="优惠分类" :data="types" :columns="1" v-model="tmpType" ref="picker3" @on-show=""
                    @on-hide="" @on-change="changeType"></popup-picker>-->
      <cell title="0-3楼：" :inline-desc="'费用: '+ params.costSection1" primary="content">
        <range :min="0" :max="100" v-model="params.costSection1" @on-change=""></range>
      </cell>
      <cell title="3-7楼：" :inline-desc="'费用: '+ params.costSection2" primary="content">
        <range :min="0" :max="100" v-model="params.costSection2" @on-change=""></range>
      </cell>
      <cell title="7-10楼：" :inline-desc="'费用: '+ params.costSection3" primary="content">
        <range :min="0" :max="200" v-model="params.costSection3" @on-change=""></range>
      </cell>
      <!--<x-input title="0-3楼：" placeholder="上楼费" required text-align="right" v-model="params.costSection1"></x-input>
      <x-input title="3-7楼：" placeholder="上楼费" required text-align="right" v-model="params.costSection2"></x-input>
      <x-input title="7-10楼：" placeholder="上楼费" required text-align="right" v-model="params.costSection3"></x-input>-->
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
    Range
  } from 'vux'
  import {userApi, commonApi} from '../../service/main.js'

  export default {
    name: 'floor-fee',
    data() {
      return {
        isPosting: false,
        params: {
          costSection1: 0,
          costSection2: 0,
          costSection3: 0
        }
      }
    },
    components: {
      Group,
      Cell,
      XInput,
      Range
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      vm.getData()
    },
    methods: {
      getData() {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(userApi.getFloor, null, 'POST', function (res) {
          vm.isPosting = false
          if (res) {
            if (res.success && res.data) {
              vm.params.costSection1 = res.data.costSection1 || 0
              vm.params.costSection2 = res.data.costSection2 || 0
              vm.params.costSection3 = res.data.costSection3 || 0
            }
          }
        }, function () {
          vm.isPosting = false
        })
      },
      validate() {
        if (!vm.tmpType.length) {
          vm.toast('请选择优惠分类！')
          return false
        }
        if (!vm.params.name) {
          vm.toast('请填写优惠名称！')
          return false
        }
        if (!vm.params.discount) {
          vm.toast('请填写抵扣金额！')
          return false
        }
        return true
      },
      update() {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.addFloor, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          vm.$router.back()
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      onChange(val) {
        console.log('change', val)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .floor-fee-con {
    .bottom {
      margin-top: 10/@rem;
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
