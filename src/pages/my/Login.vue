<template>
  <div class="login-con" v-cloak>
    <group>
      <x-input title="手机号：" placeholder="您的手机号" required type="tel" text-align="right" v-model="params.phone">
        <!--<img slot="label" style="padding-right:10px;display:block;" src="http://dn-placeholder.qbox.me/110x110/FF2D55/000" width="24" height="24">-->
      </x-input>
      <x-input title="密码：" placeholder="密码" required type="password" text-align="right"
               v-model="params.passwd"></x-input>
    </group>
    <div class="btn btn-login" @click="login">登录</div>
    <div class="btn btn-regist" v-jump="['regist']">注册</div>
    <a class="forgetPsw" href="#/reset_psw">忘记密码&nbsp;<i class="fa fa-question-circle"></i></a>
    <p class="b-txt">友你生活 | 开启崭新生活</p>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XInput} from 'vux'
  import {commonApi} from '../../service/main.js'

  export default {
    name: 'login-con',
    data() {
      return {
        isPosting: false,
        lastPage: null,
        params: {
          phone: null,
          passwd: null
        }
      }
    },
    components: {Group, Cell, XInput},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      me.attachClick()
      // vm.checkServer()
      vm.params.phone = vm.$route.query.phone || null
      vm.params.passwd = vm.$route.query.psw || null
    },
    /*watch: {
      '$route'(to, from) {
      }
    },*/
    methods: {
      checkServer() {
        // 检测是否登录
        vm.loadData(commonApi.login, null, 'POST', function (res) {
          if (res.data.success) {
            /* 保存用户信息 */
            me.locals.set('ynVendorLogin', me.formatDate(new Date(), null, 1))
            vm.$store.commit('storeData', {key: 'isLogin', data: true})
            vm.$router.push({path: '/home'})
          }
        }, function () {
        })
      },
      login() {
        if (vm.isPosting) return false
        if (!vm.params.phone) {
          vm.toast('请填写手机号 ！', 'warn')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          vm.toast('请填写正确的手机号 ！', 'warn')
          return false
        }
        if (!vm.params.passwd) {
          vm.toast('请填写密码 ！', 'warn')
          return false
        }
        vm.isPosting = true
        vm.processing()
        vm.loadData(commonApi.login, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.data.success) {
            vm.isPosting = false
            vm.toast('登录成功 ！')
            /* 保存用户信息 */
            me.locals.set('ynVendorLogin', me.formatDate(new Date(), null, 1))
            vm.$store.commit('storeData', {key: 'isLogin', data: true})
            // if (vm.lastPage === 'regist' || vm.lastPage === 'login') {
            vm.jump('home')
            /*} else {
              vm.$router.back()
            }*/
          } else {
            vm.toast('账户不存在或密码错误 ！')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .login-con {
    .rel;
    height: 100%;
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 26/@rem 30/@rem;
        .fz(28);
      }
    }
    .btn-login {
      width: 96%;
      margin: 20/@rem auto;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem 0;
      .center;
      .cf;
      .fz(28);
      .bdiy(#16a542);
      .borR(4px);
    }
    .btn-regist {
      width: 96%;
      margin: 20/@rem auto;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem 0;
      .center;
      .c3;
      .fz(28);
      .bf;
      .bor;
      .borR(4px);
    }
    .forgetPsw {
      .c6;
      .fz(24);
      .fr;
      padding: 10/@rem;
    }
    .b-txt {
      .abs;
      .center;
      width: 100%;
      bottom: 0;
      padding: 30/@rem 0;
      .cb;
      .fz(20);
    }
  }

</style>
