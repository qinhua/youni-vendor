<template>
  <div class="seller-edit" v-cloak>
    <div class="f-wrap" v-if="!showMap">
      <group>
        <x-input title="店铺名称：" placeholder="店铺名称" required text-align="right" v-model="params.name"></x-input>
        <datetime title="营业时间" format="HH:mm" minute-row :min-hour="6" :max-hour="23" v-model="params.businessTime"
                  @on-change="changeTime"></datetime>
        <img-uploader title="店铺头像" :api="fileApi" :limit="1" @on-uploaded="getImgUrl"></img-uploader>
      </group>
      <group class="bottom">
        <x-address class="address-area" title="所在地区" @on-hide="" @on-shadow-change="changeArea" :list="addressData"
                   placeholder="请选择地区">
          <template slot="title" scope="props">
        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
          <span style="vertical-align:middle;">所在地区：</span>
        </span>
          </template>
        </x-address>
        <x-input title="详细地址：" placeholder="输入详细地址" required readonly text-align="right" v-model="tmpAddress.detail"
                 @click.native="choosePoint"></x-input>
        <x-textarea title="店铺简介：" :max="200" placeholder="店铺简介" @on-blur="" v-model="params.note"
                    show-clear></x-textarea>
      </group>
      <div class="btn btn-save" @click="updateSeller"><i class="fa fa-save"></i>&nbsp;保存</div>
    </div>
    <amap @on-receive-data="getMap" v-if="showMap"></amap>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XInput, XTextarea, PopupPicker, Datetime, XAddress, ChinaAddressV3Data} from 'vux'
  import {commonApi, userApi} from '../../service/main.js'
  import imgUploader from '../../components/ImgUploader.vue'
  import Amap from '../../components/Amap.vue'

  export default {
    name: 'seller-edit',
    data() {
      return {
        fileApi: commonApi.uploadImg,
        showMap: false,
        isPosting: false,
        addressData: ChinaAddressV3Data,
        tmpAddress: {province: '', city: '', detail: ''},
        params: {}
      }
    },
    components: {Group, Cell, XInput, XTextarea, PopupPicker, Datetime, XAddress, imgUploader, Amap},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getSeller()
    },
    methods: {
      getMap(data) {
        vm.showMap = false;
        console.log(data, 'home amap info')
        if (data) {
          vm.params.lon = data.lng
          vm.params.lat = data.lat
          vm.tmpAddress.detail = data.name
        }
      },
      choosePoint() {
        vm.showMap = true;
      },
      onHide() {
//        console.log(vm.$refs.type)
      },
      getImgUrl(data) {
        if (me.isArray(data)) {
          vm.params.headimgurl = data.join(',')
        } else {
          vm.params.headimgurl = ''
        }
      },
      validate() {
        if (!vm.params.name) {
          vm.toast('请填写店铺名！')
          return false
        }
        if (!vm.tmpAddress.province) {
          vm.toast('请选择地区！')
          return false
        }
        if (!vm.tmpAddress.detail) {
          vm.toast('请填写详细地址！')
          return false
        }
        if (!vm.params.note) {
          vm.toast('请填写店铺简介！')
          return false
        }
        return true
      },
      getSeller(needSave) {
        /*try {
         vm.params = vm.$route.params.userinfo ? JSON.parse(window.decodeURIComponent(vm.$route.params.userinfo)) : {}
         console.log(vm.params, '带过来的数据')
         } catch (e) {
         // console.log(e)
         }*/
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(userApi.get, null, 'POST', function (res) {
          vm.isPosting = false
          if (res.success && res.data) {
            var resD = res.data
            vm.params.id = resD.id
            vm.params.name = resD.name
            vm.params.headimgurl = resD.headimgurl
            vm.params.address = resD.address
            vm.params.note = resD.note
            if (needSave) {
              vm.$store.commit('storeData', {key: 'userInfo', data: res.data})
              me.sessions.set('ynSellerInfo', JSON.stringify(res.data))
            }
          }
          // console.error(vm.params)
        }, function () {
          vm.isPosting = false
        })
      },
      updateSeller() {
        if (vm.isPosting) return false
        if (vm.validate()) {
          vm.isPosting = true
          vm.processing()
          if (vm.tmpAddress.detail.indexOf('省') === -1 && vm.tmpAddress.detail.indexOf('市') === -1) {
            vm.params.address = vm.tmpAddress.province + vm.tmpAddress.city + vm.tmpAddress.detail
          } else {
            vm.params.address = vm.tmpAddress.detail
          }
          vm.loadData(userApi.update, vm.params, 'POST', function (res) {
            vm.isPosting = false
            vm.processing(0, 1)
            if (res.success) {
              vm.toast('资料更新成功')
              vm.getSeller(true)
              vm.$router.back()
            } else {
              vm.toast('设置失败！')
            }
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          }, true)
        }
      },
      changeArea(ids, names) {
        console.log(ids, names)
        vm.params.province = ids[0]
        vm.params.city = ids[1]
        vm.tmpAddress.province = names[0]
        vm.tmpAddress.city = names[1].indexOf('市辖区') === -1 ? names[1] : ''
        vm.area = names[0] + (names[1].indexOf('市辖区') === -1 ? names[1] : '') + names[2]
        // vm.params.area = names[0] + (names[1].indexOf('市辖区') === -1 ? names[1] : '') + names[2]
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .seller-edit {
    height: 100%;
    overflow-x: hidden;
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        .fz(26);
      }
    }
    .bottom {
      margin-top: 10/@rem;
    }
    .btn-save {
      .fix;
      bottom: 0;
      width: 100%;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem;
      .center;
      .cf;
      .fz(28);
      .bdiy(#16a542);
    }
  }

</style>
