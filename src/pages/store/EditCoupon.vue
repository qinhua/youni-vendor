<template>
  <div class="coupon-edit-con" v-cloak>
    <group>
      <popup-picker title="优惠分类" :data="types" :columns="1" v-model="tmpType" ref="picker3" @on-show=""
                    @on-hide="" @on-change="changeType"></popup-picker>
      <x-input title="优惠名称：" placeholder="优惠名称" required text-align="right" v-model="params.name"></x-input>
      <!--<selector placeholder="商品分类" v-model="params.goodsType" title="商品分类" name="goodsType" :options="types"-->
      <!--@on-change="changeType"></selector>-->
      <!--<popup-picker title="商品类目" :data="categories" :columns="1" v-model="tmpCat" ref="picker3" @on-show=""
                    @on-hide="" @on-change="changeCategory"></popup-picker>-->
      <x-input title="抵扣金额：" placeholder="抵扣金额" required text-align="right" v-model="params.discount"></x-input>
      <datetime title="开始时间" required v-model="params.beginTime" @on-change="onChange"></datetime>
      <datetime title="过期时间" required v-model="params.endTime" @on-change="onChange"></datetime>
    </group>
    <group class="bottom">
      <x-textarea title="优惠说明：" :max="20" placeholder="优惠说明" @on-blur="" v-model="params.discountNote"
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
    XTextarea
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
        couponId: null,
        coupons: null,
        types: [{key: 1, value: '优惠券', name: '优惠券'}, {key: 2, value: '满减', name: '满减'}],
        params: {
          id: null,
          name: '',
          type: 1,
          discount: null,
          beginTime: '',
          endTime: '',
          discountNote: ''
        },
        tmpType: []
      }
    },
    components: {
      Group,
      XInput,
      Datetime,
      PopupPicker,
      XTextarea
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      vm.params.sellerId = vm.$store.state.global.sellerId
      vm.params.id = vm.$route.query.id
      vm.params.id ? vm.getData() : null
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
            vm.switchData(vm.types, vm.params.type, 'tmpType')
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
        if (!vm.params.name) {
          vm.toast('请填写优惠名称！')
          return false
        }
        if (!vm.params.discount) {
          vm.toast('请填写抵扣金额！')
          return false
        }
        if (!vm.params.beginTime) {
          vm.toast('请选择开始时间！')
          return false
        }
        if (!vm.params.endTime) {
          vm.toast('请选择过期时间！')
          return false
        }
        return true
      },
      update() {
        if (vm.isPosting || !vm.validate()) return false
        /*此处转换一些字段类型*/
        let curApi
        vm.switchData(vm.types, vm.tmpType, 'type')
        if (vm.couponId) {
          curApi = userApi.updateCoupon
          vm.params.id = vm.couponId
        } else {
          delete vm.params.id
          curApi = userApi.addCoupon
        }
        console.log('最后选择的数据：', vm.params)
        vm.isPosting = true
        vm.processing()
        vm.loadData(curApi, vm.params, 'POST', function (res) {
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
      },
      changeType(val) {
        vm.switchData(vm.types, vm.tmpType, 'type')
        console.log(val, vm.params.type)
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
      .tags-group {
        .rel;
        padding: 24/@rem 10/@rem;
        .fz(26);
        label {
          .block;
          width: 100%;
          padding-bottom: 18/@rem;
        }
        .tags-cons {
          .borBox;
        }
        .tags-input {
          .bf5;
          .tag {
            .cf;
            .bdiy(#ef834f)
          }
        }
      }
      .upload-group {
        .rel;
        .flex;
        padding: 24/@rem 30/@rem;
        .fz(26);
        label {
          .block;
          width: 180/@rem;
          /* padding-bottom: 18/@rem;*/
        }
      }
      .editor-group {
        .rel;
        padding: 24/@rem 10/@rem;
        .fz(26);
        .bor-t;
        label {
          .block;
          width: 100%;
          padding-bottom: 18/@rem;
        }
        .ql-toolbar {
          padding: 8px 0;
        }
        .ql-editor {
          /*-webkit-user-select:text;*/
          /*user-select:text;*/

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
