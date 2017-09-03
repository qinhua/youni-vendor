<template>
  <div class="regist-con" v-cloak>
    <div :class="['f-wrap',showMap?'none':'']">
      <group>
        <x-input title="商家名称：" placeholder="商家名称" text-align="right" required v-model="params.name"></x-input>
        <x-input title="商家电话：" placeholder="您的手机号" text-align="right" type="tel" required
                 v-model="params.phone"></x-input>
        <!--<x-input title="登录密码：" placeholder="登录密码" type="password" text-align="right" required
                 v-model="params.passwd"></x-input>-->
        <x-input title="公司名称：" placeholder="公司名称" required text-align="right" v-model="params.companyName"></x-input>
      </group>
      <group class="bottom">
        <popup-picker title="认证级别" :data="levels" :columns="1" v-model="tmpLevel" @on-show=""
                      @on-hide="" @on-change="changeLevel"></popup-picker>
        <popup-picker title="平台分类" :data="types" :columns="1" v-model="tmpType" @on-show=""
                      @on-hide="" @on-change="changeType"></popup-picker>
        <popup-picker title="业务分类" :data="serTypes" :columns="1" v-model="tmpSerType" @on-show=""
                      @on-hide="" @on-change="changeSerType"></popup-picker>
        <!--<x-textarea title="店铺公告：" :max="20" placeholder="店铺公告" @on-blur="" v-model="topic" show-clear></x-textarea>-->
        <x-address class="address-area" title="所在地区" @on-hide="onHide" @on-shadow-change="changeArea"
                   :list="addressData"
                   placeholder="请选择地区">
          <template slot="title" scope="props">
        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
          <span style="vertical-align:middle;">所在地区：</span>
        </span>
          </template>
        </x-address>
        <x-input title="详细地址：" placeholder="输入详细地址" required readonly text-align="right" v-model="tmpAddress.detail"
                 @click.native="choosePoint"></x-input>
        <img-uploader title="营业执照" :api="fileApi" :limit="1" @on-uploaded="getImgUrl"></img-uploader>
        <x-input title="验证码：" class="weui-vcode" v-model="params.smsCode">
          <x-button slot="right" type="primary" mini :disabled="btnStatus" @click.native="getCode">{{btnText}}
          </x-button>
        </x-input>
      </group>
      <div class="btn btn-save" @click="register"><i class="fa fa-save"></i>&nbsp;提交申请</div>
    </div>
    <amap :visible="showMap" tools="" @on-receive-data="getMap"></amap>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XInput, XButton, PopupPicker, XTextarea, XAddress, ChinaAddressV3Data} from 'vux'
  import imgUploader from '../../components/ImgUploader.vue'
  import Amap from '../../components/Amap.vue'
  import {userApi, commonApi} from '../../service/main.js'

  export default {
    name: 'regist-con',
    data() {
      return {
        onFetching: false,
        isPosting: false,
        fileApi: commonApi.uploadImg,
        addressData: ChinaAddressV3Data,
        detailAddress: '',
        showMap: false,
        hasImg: '',
        sellerId: null,
        types: [{key: 1, value: '直营店', name: '直营店'}, {key: 2, value: '非直营店', name: '非直营店'}],
        serTypes: [{key: 'seller_service_type.1', value: '水', name: '水'}, {
          key: 'seller_service_type.2',
          value: '奶',
          name: '奶'
        }, {key: 'seller_service_type.3', value: '全部', name: '全部'}],
        levels: [{key: 'seller_level.1', value: '普通店', name: '普通店'}, {
          key: 'seller_level.2',
          value: '官方店',
          name: '官方店'
        }, {key: 'seller_level.3', value: '金牌店', name: '金牌店'}],
        tmpType: [],
        tmpSerType: [],
        tmpLevel: [],
        tmpAddress: {province: '', city: '', detail: ''},
        btnText: '发送验证码',
        btnStatus: false,
        params: {
          name: '',
          phone: '',
          // passwd: '',
          companyName: '',
          address: '',
          lat: '',
          lon: '',
          province: '',
          city: '',
          serviceType: '',
          authLevel: '',
          businessLicense: '',
          smsCode: ''
        }
      }
    },
    components: {Group, Cell, XInput, XButton, PopupPicker, XTextarea, XAddress, ChinaAddressV3Data, imgUploader, Amap},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
//        vm.levels = vm.$store.commit('getFromDict', 'seller_level')
    },
    methods: {
      getMap(data) {
        vm.showMap = false;
        console.log(data, 'home amap info')
        vm.params.lon = data.lng
        vm.params.lat = data.lat
        vm.tmpAddress.detail = data.name
        // alert(JSON.stringify(vm.params, null, 2))
        /*vm.geo = {}
         if (data.type === 'complete') {
         vm.geo = {
         success: true,
         responseText: '定位成功',
         province: data.addressComponent ? data.addressComponent.province : '',
         city: data.addressComponent ? data.addressComponent.city : '',
         cityCode: data.addressComponent ? data.addressComponent.adcode : '',
         provinceCode: data.addressComponent ? data.addressComponent.citycode : '',
         lat: data.position.lat,
         lng: data.position.lng,
         address: data.formattedAddress || ''
         }
         vm.$store.commit('storeGeo', vm.geo)
         } else {
         vm.geo = {
         success: false,
         responseText: '定位失败'
         }
         }*/
      },
      choosePoint() {
        vm.showMap = true;
      },
      onHide() {
//        console.log(vm.$refs.typ)
      },
      getImgUrl(data) {
        if (me.isArray(data)) {
          vm.params.businessLicense = data.join(',')
        } else {
          vm.params.businessLicense = ''
        }
      },
      switchData(data, value, target) {
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
      getCode() {
        if (vm.isPosting) return false
        if (!vm.params.phone) {
          vm.toast('请填写手机号 ！', 'warn')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          vm.toast('请填写正确的手机号 ！', 'warn')
          return false
        }
        vm.isPosting = true
        vm.loadData(commonApi.sendSms, {phone: vm.params.phone, useType: 1}, 'POST', function (res) {
          vm.toast('已发送，请注意查收！')
          vm.btnText = '60s后再次获取'
          vm.btnStatus = true
          setTimeout(function () {
            vm.btnText = '发送验证码'
            vm.btnStatus = false
          }, 60000)
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      checkCode() {
        vm.loadData(commonApi.checkCode, {
          phone: vm.params.phone,
          useType: 1,
          code: vm.params.smsCode
        }, 'POST', function (res) {
          if (res.success) {
            return true
          } else {
            vm.toast(res.message, 'warn')
            vm.btnText = '发送验证码'
            vm.btnStatus = false
            vm.isPosting = false
            return false
          }
        }, function () {
          vm.isPosting = false
          return false
        })
      },
      validate() {
        if (!vm.params.name) {
          vm.toast('请填写商家名！', 'warn')
          return false
        }
        if (!vm.params.phone) {
          vm.toast('请填写手机号！', 'warn')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          vm.toast('请填写正确的手机号！', 'warn')
          return false
        }
        /*if (!vm.params.passwd) {
         vm.toast('请填写登录密码！')
         return false
         }*/
        if (!vm.params.companyName) {
          vm.toast('请填写公司名！', 'warn')
          return false
        }
        if (!vm.tmpAddress.province) {
          vm.toast('请选择地区！', 'warn')
          return false
        }
        if (!vm.tmpAddress.detail) {
          vm.toast('请选择详细地址！', 'warn')
          return false
        }
        if (!vm.params.authLevel) {
          vm.toast('请选择认证级别！', 'warn')
          return false
        }
        if (vm.params.type === '') {
          vm.toast('请选择平台分类！', 'warn')
          return false
        }
        if (vm.params.serviceType === '') {
          vm.toast('请选择业务分类！', 'warn')
          return false
        }
        if (vm.params.authLevel === '') {
          vm.toast('请选择认证级别！', 'warn')
          return false
        }
        if (!vm.params.businessLicense) {
          vm.toast('请上传营业执照！', 'warn')
          return false
        }
        if (!vm.params.smsCode) {
          vm.toast('请填写验证码！', 'warn')
          return false
        }
        return true
      },
      register() {
        if (vm.isPosting) return
        vm.params.address = vm.tmpAddress.province + vm.tmpAddress.city + vm.tmpAddress.detail
        if (vm.validate()) {
          console.log(vm.params)
          vm.isPosting = true
          vm.processing()
          vm.loadData(userApi.regist, vm.params, 'POST', function (res) {
            vm.processing(0, 1)
            if (res.success) {
              vm.toast('入驻成功！')
              vm.jump('login', {phone: vm.params.phone, psw: vm.params.phone.substr(-6)})
            } else {
              vm.toast(res.message, 'warn')
            }
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          })
        }
      },
      changeArea(ids, names) {
        console.log(ids, names)
        vm.params.province = ids[0]
        vm.params.city = ids[1]
        vm.tmpAddress.province = names[0]
        vm.tmpAddress.city = names[1].indexOf('市辖区') === -1 ? names[1] : ''
        // vm.params.area = names[0] + (names[1].indexOf('市辖区') === -1 ? names[1] : '') + names[2]
      },
      changeType(val) {
        vm.switchData(vm.types, vm.tmpType, 'type')
        console.log(val, vm.params.type)
      },
      changeSerType(val) {
        vm.switchData(vm.serTypes, vm.tmpSerType, 'serviceType')
        console.log(val, vm.params.serviceType)
      },
      changeLevel(val) {
        vm.switchData(vm.levels, vm.tmpLevel, 'authLevel')
        console.log(val)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .regist-con {
    height: 100%;
    overflow-x: hidden;
    .f-wrap {
      .rel;
      z-index: 1000;
      height: 100%;
      padding-bottom: 50px;
    }
    .bottom {
      margin-top: 10/@rem;
    }
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        input{
          .ellipsis;
        }
      }
      .vux-x-input, .address-area, .vux-cell-box, .vux-x-textarea {
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
