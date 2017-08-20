<template>
  <div class="store-con">
    <group>
      <x-input title="店铺名称：" placeholder="店铺名称" required text-align="right" v-model="storeName"></x-input>
      <!--<x-input title="公司名称：" placeholder="公司名称" required v-model="companyName"></x-input>-->
      <!--<x-input title="店铺简介：" placeholder="店铺简介" required v-model="description"></x-input>-->
      <x-textarea title="店铺简介：" :max="20" placeholder="店铺简介" @on-blur="" v-model="description" show-clear></x-textarea>
      <x-input title="认证信息：" placeholder="认证信息" text-align="right" v-model="authInfo"></x-input>
      <x-input title="店铺头像：" placeholder="上传店铺头像" text-align="right" v-model="storeImg"></x-input>
    </group>
    <group class="bottom">
      <!--<x-input title="店铺公告：" placeholder="店铺公告" v-model="topic"></x-input>-->
      <x-textarea title="店铺公告：" :max="20" placeholder="店铺公告" @on-blur="" v-model="topic" show-clear></x-textarea>
      <x-address class="address-area" title="所在地区" @on-hide="logHide" @on-shadow-change="changeArea" :list="addressData"
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
  import {Group, Cell, XInput, XTextarea, XAddress, ChinaAddressV3Data} from 'vux'
  import {userApi} from '../../service/main.js'

  export default {
    name: 'my-edit',
    data() {
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
    components: {Group, Cell, XInput, XTextarea, XAddress, ChinaAddressV3Data},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      // vm.userId = vm.$route.query.userId
      vm.sellerId = vm.$store.state.sellerId
      console.log(vm.sellerId)
      vm.getStore()
    },
    methods: {
      getStore() {
        vm.processing()
        vm.loadData(userApi.updateName, {id: vm.sellerId}, 'POST', function (res) {
          console.log(res.data, '店铺信息')
          this.$store.commit('updateStore', res.data)
          vm.processing(0, 1)
        }, function () {
          vm.processing(0, 1)
        })
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
        if (vm.isPosting || !vm.validate()) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.updateName, {
          id: vm.sellerId,
          name: vm.storeName,
          avtar: vm.storeImg,
          authInfo: vm.authInfo,
          description: vm.description,
          topic: vm.topic,
          area: vm.area,
          detailAddress: vm.detailAddress
        }, 'POST', function (res) {
          this.$store.commit('updateStore', res.data)
          vm.$router.back()
          vm.isPosting = false
          vm.processing(0, 1)
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      logHide(str) {
        console.log('on-hide', str)
      },
      changeArea(ids, names) {
        console.log(ids, names)
        vm.area = names.join('')
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .store-con {
    .bottom {
      margin-top: 10/@rem;
    }
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
      }
      .vux-x-input,.address-area,.vux-x-textarea {
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
