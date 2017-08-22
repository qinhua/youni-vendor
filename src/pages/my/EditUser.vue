<template>
  <div class="seller-edit">
    <group>
      <x-input title="店铺名称：" placeholder="店铺名称" required text-align="right" v-model="storeName"></x-input>
      <x-textarea title="店铺简介：" :max="20" placeholder="店铺简介" @on-blur="" v-model="description" show-clear></x-textarea>
      <x-input title="认证信息：" placeholder="认证信息" text-align="right" v-model="authInfo"></x-input>
      <x-input title="店铺头像：" placeholder="上传店铺头像" text-align="right" v-model="storeImg"></x-input>
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
      <x-input title="详细地址：" placeholder="输入详细地址" required text-align="right" v-model="detailAddress"></x-input>
    </group>
    <div class="btn btn-save" @click="updateStore"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XInput,XTextarea, XAddress, ChinaAddressV3Data} from 'vux'
  import {userApi} from '../../service/main.js'

  export default {
    name: 'seller-edit',
    data () {
      return {
        onFetching: false,
        isPosting: false,
        addressData: ChinaAddressV3Data,
        sellerId: null,
        storeName: '',
        storeImg: '',
        authInfo: '',
        description: '',
        topic: '',
        area: '',
        detailAddress: ''
      }
    },
    components: {Group, Cell, XInput,XTextarea, XAddress, ChinaAddressV3Data},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
      vm.sellerId = vm.$route.params.id
      console.log(vm.sellerId)
    },
    methods: {
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
        vm.loadData(userApi.updateSeller, {
          id: vm.sellerId,
          name: vm.storeName,
          avtar: vm.storeImg,
          authInfo: vm.authInfo,
          description: vm.description,
          area: vm.area,
          detailAddress: vm.detailAddress
        }, 'POST', function (res) {
          vm.$router.back()
          vm.isPosting = false
          vm.processing(0, 1)
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
