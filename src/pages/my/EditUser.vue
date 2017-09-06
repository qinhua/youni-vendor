<template>
  <div class="seller-edit" v-cloak>
    <div class="f-wrap" v-if="!showMap">
      <group>
        <x-input title="店铺名称：" placeholder="店铺名称" required text-align="right" v-model="storeName"></x-input>
        <x-textarea title="店铺简介：" :max="20" placeholder="店铺简介" @on-blur="" v-model="description"
                    show-clear></x-textarea>
        <x-input title="认证信息：" placeholder="认证信息" text-align="right" v-model="authInfo"></x-input>
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
        <x-input title="详细地址：" placeholder="输入详细地址" required readonly text-align="right" v-model="detailAddress"
                 @click.native="choosePoint"></x-input>
      </group>
      <div class="btn btn-save" @click="updateStore"><i class="fa fa-save"></i>&nbsp;保存</div>
    </div>
    <amap @on-receive-data="getMap" v-if="showMap"></amap>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XInput,XTextarea, XAddress, ChinaAddressV3Data} from 'vux'
  import {commonApi,userApi} from '../../service/main.js'
  import imgUploader from '../../components/ImgUploader.vue'
  import Amap from '../../components/Amap.vue'

  export default {
    name: 'seller-edit',
    data () {
      return {
        fileApi: commonApi.uploadImg,
        showMap: false,
        isPosting: false,
        addressData: ChinaAddressV3Data,
        seller:{},
        sellerId: null,
        storeName: '',
        authInfo: '',
        description: '',
        topic: '',
        area: '',
        detailAddress: '',
        params:{
          storeImg: '',
          lon:'',
          lat:'',
          address:''
        }
      }
    },
    components: {Group, Cell, XInput, XTextarea, XAddress, ChinaAddressV3Data, imgUploader, Amap},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
      vm.sellerId = vm.$route.params.id
      console.log(vm.sellerId)
      vm.getSeller()
    },
    methods: {
      getMap(data) {
        vm.showMap = false;
        console.log(data, 'home amap info')
        if(data){
          vm.params.lon = data.lng
          vm.params.lat = data.lat
          vm.detailAddress = data.name
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
          vm.params.storeImg = data.join(',')
        } else {
          vm.params.storeImg = ''
        }
      },
      validate() {
        if (!vm.storeName) {
          vm.toast('请填写店铺名！')
          return false
        }
        if (!vm.description) {
          vm.toast('请填写店铺简介！')
          return false
        }
        if (!vm.detailAddress) {
          vm.toast('请填写店铺地址！')
          return false
        }
      },
      updateStore() {
        console.log({
          id: vm.sellerId,
          name: vm.storeName,
          avtar: vm.storeImg,
          authInfo: vm.authInfo,
          description: vm.description,
          area: vm.area,
          detailAddress: vm.detailAddress
        })
        if (vm.isPosting || !vm.validate()) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.set, {
          id: vm.sellerId,
          name: vm.storeName,
          avtar: vm.storeImg,
          authInfo: vm.authInfo,
          description: vm.description,
          area: vm.area,
          detailAddress: vm.detailAddress
        }, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          vm.$router.back()
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      getSeller() {
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.view, {}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          vm.seller=res.data
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      changeArea(ids, names) {
        console.log(ids, names)
        // vm.area = names.join('')
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
        .fz(28);
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
