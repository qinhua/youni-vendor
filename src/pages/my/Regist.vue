<template>
  <div class="regist-con">
    <group>
      <x-input title="商家名称：" placeholder="商家名称" text-align="right" required v-model="params.name"></x-input>
      <x-input title="商家电话：" placeholder="商家电话" text-align="right" type="tel" required v-model="params.phone"></x-input>
      <x-input title="登录密码：" placeholder="登录密码" type="password" text-align="right" required
               v-model="params.passwd"></x-input>
      <x-input title="公司名称：" placeholder="公司名称" required text-align="right" v-model="params.companyName"></x-input>
    </group>
    <group class="bottom">
      <popup-picker title="店铺分类" :data="types" :columns="1" v-model="tmpType" @on-show=""
                    @on-hide="" @on-change="changeType"></popup-picker>
      <popup-picker title="认证级别" :data="levels" :columns="1" v-model="tmpLevel" @on-show=""
                    @on-hide="" @on-change="changeLevel"></popup-picker>
      <!--<x-textarea title="店铺公告：" :max="20" placeholder="店铺公告" @on-blur="" v-model="topic" show-clear></x-textarea>-->
      <x-address class="address-area" title="所在地区" @on-hide="logHide" @on-shadow-change="changeArea" :list="addressData"
                 placeholder="请选择地区">
        <template slot="title" scope="props">
        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
          <span style="vertical-align:middle;">所在地区：</span>
        </span>
        </template>
      </x-address>
      <x-input title="详细地址：" placeholder="输入详细地址" required text-align="right" v-model="params.detailAddress"></x-input>
      <x-input title="营业执照：" placeholder="上传营业执照" text-align="right" v-model="hasImg"></x-input>
    </group>
    <div class="btn btn-save" @click="register"><i class="fa fa-save"></i>&nbsp;提交申请</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XInput, PopupPicker, XTextarea, XAddress, ChinaAddressV3Data} from 'vux'
  import {userApi} from '../../service/main.js'

  export default {
    name: 'regist-con',
    data() {
      return {
        onFetching: false,
        isPosting: false,
        addressData: ChinaAddressV3Data,
        detailAddress: '',
        hasImg: '',
        sellerId: null,
        types: [{key: 0, value: '全部', name: '全部'}, {key: 1, value: '水', name: '水'}, {key: 2, value: '奶', name: '奶'}],
        levels: [{key: 1, value: '普通店', name: '普通店'}, {key: 2, value: '官方店', name: '官方店'}, {
          key: 3,
          value: '金牌店',
          name: '金牌店'
        }],
        tmpType: [],
        tmpLevel: [],
        params: {
          name: '',
          phone: '',
          passwd: '',
          companyName: '',
          address: '',
          lat: '',
          lon: '',
          province: '',
          city: '',
          type: '',
          authLevel: '',
          businessLicense: '',
        }
      }
    },
    components: {Group, Cell, XInput, PopupPicker, XTextarea, XAddress, ChinaAddressV3Data},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
    },
    methods: {
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
      validate() {
        if (!vm.params.name) {
          vm.toast('请填写商家名！')
          return false
        }
        if (!vm.params.phone) {
          vm.toast('请填写商家电话！')
          return false
        }
        if (!vm.params.passwd) {
          vm.toast('请填写登录密码！')
          return false
        }
        if (!vm.params.companyName) {
          vm.toast('请填写公司名！')
          return false
        }
        if (!vm.params.province) {
          vm.toast('请选择地区！')
          return false
        }
        if (!vm.params.address) {
          vm.toast('请选择详细地址！')
          return false
        }
        if (!vm.params.type) {
          vm.toast('请选择店铺分类！')
          return false
        }
        if (!vm.params.authLevel) {
          vm.toast('请选择认证级别！')
          return false
        }
        if (!vm.params.businessLicense) {
          vm.toast('请上传营业执照！')
          return false
        }
      },
      register() {
        console.log(vm.params)
        if (vm.isPosting || !vm.validate()) return false
        vm.switchData(vm.types, vm.tmpType, 'type')
        vm.switchData(vm.levels, vm.tmpLevel, 'authLevel')
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.updateName, vm.params, 'POST', function (res) {
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
        vm.province = ids[0]
        vm.city = ids[1]
      },
      changeType(val) {
        console.log(val, vm.params.type)
      },
      changeLevel(val) {
        console.log(val)
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .regist-con {
    .bottom {
      margin-top: 10/@rem;
    }
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
      }
      .vux-x-input, .address-area, .vux-cell-box, .vux-x-textarea  {
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
