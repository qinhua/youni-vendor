<template>
  <div class="coupon-edit-con" v-cloak>
    <group>
      <popup-picker title="优惠分类：" :data="types" :columns="1" v-model="tmpType" ref="picker3" @on-show=""
                    @on-hide="" @on-change="changeType"></popup-picker>
      <!--<x-input title="优惠名称：" placeholder="优惠名称" required text-align="right" v-model="params.name"></x-input>-->
      <x-input title="优惠条件：" placeholder="满多少元减免" required text-align="right" v-model="params.upAmount"></x-input>
      <x-input title="优惠金额：" placeholder="抵扣的金额" required text-align="right" v-model="params.discountAmount"></x-input>
      <x-input title="最大优惠：" placeholder="最高优惠金额" required text-align="right"
               v-model="params.maxDiscountAmount"></x-input>
      <!--<datetime title="开始时间" required v-model="params.beginTime" @on-change="onChange"></datetime>-->
      <x-switch title="是否过期" v-model="needExpire"></x-switch>
      <datetime title="过期时间：" required v-model="params.expireTime" @on-change="onChange" v-show="needExpire"></datetime>
    </group>
    <group class="bottom">
      <x-textarea title="优惠说明：" :max="20" placeholder="如水票买20送1" @on-blur="" v-model="params.discountNote"
                  show-clear></x-textarea>
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
    XInput,
    Datetime,
    PopupPicker,
    XTextarea,
    XSwitch
  } from 'vux'
  import {userApi, commonApi} from '../../service/main.js'

  export default {
    name: 'coupon-edit',
    data() {
      return {
        formatValueFunction(val) {
          return val.replace(/-/g, '$')
        },
        isPosting: false,
        coupons: null,
        needExpire: true,
        types: [
          {
            key: 'goods_type.1',
            value: '水',
            name: '水'
          },
          {
            key: 'goods_type.2',
            value: '奶',
            name: '奶'
          },
          {
            key: 'goods_type.3',
            value: '水票',
            name: '水票'
          }
        ],
        tmpType: ['水'],
        params: {
          expireTime: '',
          couponNote: '',
          upAmount: '',
          discountAmount: '',
          maxDiscountAmount: '',
          goodsType: ''
        },
      }
    },
    components: {
      Group,
      XInput,
      Datetime,
      PopupPicker,
      XTextarea,
      XSwitch
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
//      vm.params.id ? vm.getData() : null
    },
    watch: {
      needExpire() {
        !vm.needExpire ? vm.params.expireTime = '' : null
      }
    },
    methods: {
      setToday() {
        let now = new Date()
        let cmonth = now.getMonth() + 1
        let day = now.getDate()
        if (cmonth < 10) cmonth = '0' + cmonth
        if (day < 10) day = '0' + day
        vm.params.beginTime = now.getFullYear() + '-' + cmonth + '-' + day
      },
      switchData(data, value, target,) {
        let tmp
        if (typeof value === 'number') {
          tmp = []
          for (let i = 0; i < data.length; i++) {
            if (value === data[i].key) {
              tmp.push(data[i].name)
            }
          }
          vm[target] = tmp
        } else {
          let tt = value.join('')
          for (let i = 0; i < data.length; i++) {
            if (tt === data[i].name) {
              tmp = data[i].key
            }
          }
          vm.params[target] = tmp
        }
      },
      getData() {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(userApi.get, {couponId: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res) {
            let resD = res.data.itemList
            /*此处转换一些字段类型*/
            vm.switchData(vm.types, vm.params.goodsType, 'tmpType')
            vm.coupons = resD
            console.log(vm.coupons)
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
        if (!vm.params.upAmount) {
          vm.toast('请填写优惠条件！')
          return false
        }
        if (!vm.params.discountAmount) {
          vm.toast('请填写优惠金额！')
          return false
        }
        /*if (!vm.params.maxDiscountAmount) {
          vm.toast('请填写最大优惠金额！')
          return false
        }*/
        /*if (!vm.params.beginTime) {
          vm.toast('请选择开始时间！')
          return false
        }*/
        if (vm.needExpire && !vm.params.expireTime) {
          vm.toast('请选择过期时间！')
          return false
        }
        return true
      },
      update() {
        if (vm.isPosting || !vm.validate()) return false
        /*此处转换一些字段类型*/
        let curApi
        if (vm.couponId) {
          curApi = userApi.updateCoupon
          vm.params.id = vm.couponId
        } else {
//          delete vm.params.id
          curApi = userApi.addCoupon
        }
        console.log('最后选择的数据：', vm.params)
        vm.isPosting = true
        vm.processing()
        vm.loadData(curApi, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
//          vm.$router.back()
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      onChange(val) {
        console.log('change', val)
      },
      changeType(val) {
        vm.switchData(vm.types, vm.tmpType, 'goodsType')
        console.log(val, vm.params.goodsType)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .coupon-edit-con {
    padding-bottom: 50px;
    .bottom {
      margin-top: 10/@rem;
    }
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
      }
      .checker-group {
        .rel;
        .flex;
        padding: 24/@rem 30/@rem;
        .fz(26);
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 15px;
          right: 0;
          height: 1px;
          border-top: 1px solid #D9D9D9;
          color: #D9D9D9;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
        label {
          .abs-center-vertical;
        }
        .vux-checker-box {
          .flex-r(1);
          .vux-checker-item {
            .fr;
            margin-left: 4px;
          }
        }
      }
      .vux-x-switch {
        .fz(24) !important;
        .weui-switch:checked {
          border-color: #f34c18;
          background-color: #f34c18;
        }
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
