// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new,no-unused-vars */
import Vue from 'vue'
import Axios from 'axios'
import App from './App'
import router from './router'
import 'font-awesome/css/font-awesome.css'
import 'ionicons/dist/css/ionicons.css'
import 'weui/dist/style/weui.min.css'
import weui from '../static/js/weui.js'
import $ from 'jquery'
import 'myMixin'
import store from './store'
import VueScroller from 'vue-scroller'
import {AlertPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin} from 'vux'

const FastClick = require('fastclick')
if (location.href.indexOf('edit_ticket') === -1 && location.href.indexOf('edit_goods') === -1) {
  FastClick.attach(document.body)
}
Vue.use(require('vue-wechat-title'))
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(VueScroller)
import {commonApi, userApi} from './service/main.js'

Vue.config.productionTip = false
let me = window.me
let vm

// 检测是否登录
var checkLogin = function (openid) {
  $.ajax({
    url: commonApi.check,
    type: 'POST',
    data: {'requestapp': '{}'},
    dataType: "JSON",
    async: false,
    cache: false,
    timeout: 3500,
    headers: {'token': openid},
    success: function (res) {
      if (res.success && res.data.success) {
        me.sessions.set('logYn', true)
      } else {
        me.sessions.remove('logYn')
      }
    },
    error: function (xhr, textStatus) {
      console.log('error:' + textStatus);
      vm.$router.push({path: '/login'})
    }
  })
}

// 在路由路由跳转前判断一些东西
router.beforeEach((to, from, next) => {
  console.info(store.state, '当前vuex中的data')

  /* 判断授权是否存在或过期(页面刷新就会触发过期检查，不包含切换账号后的检查) */
  if (store.state.global.expired) {
    var localAuth = me.locals.get('ynWxUser') ? JSON.parse(me.locals.get('ynWxUser')) : null
    if (to.path === '/author') {
      if (localAuth) {
        /* 检查本地token是否过期(7天保质期) */
        if (me.getDiffDay(localAuth.timeStamp) > 7) {
          // alert('author页授权已过期，重新授权')
          store.commit('storeData', {key: 'expired', data: true})
          console.profile('in auth page and (no id)')
          next()
        } else {
          // alert('author页授权在有效期内，进首页')
          window.youniMall.userAuth = localAuth.data
          store.commit('storeData', {key: 'wxInfo', data: localAuth.data})
          store.commit('storeData', {key: 'expired', data: false})
          console.profile('in auth page and (id)')
          /*检测登录*/
          // setTimeout(function () {
          checkLogin(window.youniMall.userAuth.openid)
          if (me.sessions.get('logYn')) {
            // alert('author页授权在有效期内，检测已登录')
            //当前已登录
            return next('/home')
          } else {
            // alert('author页授权在有效期内，检测到未登录')
            //当前未登录
            return next('/login')
          }
          // }, 0)
        }
      } else {
        // alert('author页无授权，授权中')
        console.profile('in auth page and (no id)')
        next()
      }
    } else {
      if (localAuth) {
        /* 检查本地token是否过期(7天保质期) */
        if (me.getDiffDay(localAuth.timeStamp) > 7) {
          // alert('非author页授权已过期，跳至授权')
          store.commit('storeData', {key: 'expired', data: true})
          console.profile('not in auth page and (no id)')
          me.locals.set('beforeLoginUrl', to.fullPath) // 保存用户进入的url
          return next('/author')
        } else {
          // alert('非author页授权在有效期内，进首页or继续当前')
          window.youniMall.userAuth = localAuth.data
          store.commit('storeData', {key: 'wxInfo', data: localAuth.data})
          store.commit('storeData', {key: 'expired', data: false})
          console.profile('not in auth page and (id)')
          /*检测登录*/
          checkLogin(window.youniMall.userAuth.openid)
          if (me.sessions.get('logYn')) {
            // alert('非author页授权在有效期内，检测到已登录')
            //当前已登录
            next()
            // return next('/home')
          } else {
            // alert('非author页授权在有效期内，检测到未登录')
            //当前未登录
            return next('/login')
          }
        }
      } else {
        // alert('非author页无授权，跳至授权')
        console.profile('not in auth page and (no id)')
        me.locals.set('beforeLoginUrl', to.fullPath) // 保存用户进入的url
        return next('/author')
      }
    }
  } else {
    window.youniMall.userAuth = store.state.global.wxInfo || (me.locals.get('ynWxUser') ? JSON.parse(me.locals.get('ynWxUser')).data : null)
    next()
  }
})

/* ----- 封装一些方法 -------- */
/* ajax请求 */
Vue.prototype.weui = weui
Vue.prototype.$axios = Axios
Vue.prototype.loadData = function (url, params, type, sucCb, errCb, noAuthInfo) {
  if (!url) return
  params = params || {}
  var winAuth = window.youniMall.userAuth || (me.locals.get('ynWxUser') ? JSON.parse(me.locals.get('ynWxUser')).data : null)
  var localGeo = me.sessions.get('cur5656Geo') ? JSON.parse(me.sessions.get('cur5656Geo')) : {}
  var localIps = me.sessions.get('cur5656Ips') ? JSON.parse(me.sessions.get('cur5656Ips')) : {}
  var localParams = {
    ip: localIps.cip || '',
    cityCode: localGeo.cityCode || (localIps.cid || '100000'),
    lon: localGeo.lng || '',
    lat: localGeo.lat || ''
  }
  !noAuthInfo ? $.extend(params, winAuth) : null
  // console.log('%c'+JSON.stringify(params, null, 2), 'color:#fff;background:purple')
  setTimeout(function () {
    $.ajax({
      url: url + me.param(localParams, '?'),
      type: type || 'POST',
      data: {'requestapp': JSON.stringify(params ? params : {})},
      dataType: "JSON",
      cache: false,
      headers: {token: winAuth ? winAuth.openid : ''},
      success: function (res) {
        // 检测是否登录
        /*if (res.message.indexOf('登录') > -1) {
         if (vm.$route.name === 'regist') return
         // vm.processing(0, 1)
         // vm.confirm('温馨提示','请先登录！',function(){
         vm.$router.push({path: '/login'})
         // })
         }*/
        try {
          sucCb ? sucCb(res) : console.log(res, '接口的res')
        } catch (e) {
          // console.log(e)
        }
      },
      error: function (res) {
        errCb ? errCb(res) : console.error('请求失败！')
      }
    })
    /*Axios({
     method: type || 'POST',
     url: url,
     data: {requestapp: params ? params : {}},
     responseType: 'JSON',
     cache: false,
     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'token': window.youniMall.userAuth.openid}
     }).then(function (res) {
     sucCb ? sucCb(res) : console.log(res, '接口的res')
     }).catch(function (error) {
     errCb ? errCb(error) : console.error(error, '错误信息')
     })*/
  }, 0)
}
/* alert */
Vue.prototype.alert = function (title, content, showCb, hideCb) {
  const _this = this
  _this.$vux.alert.show({
    title: title || '',
    content: content || '',
    onShow() {
      showCb ? showCb() : null
    },
    onHide() {
      hideCb ? hideCb() : null
    }
  })
}
/* confirm */
Vue.prototype.confirm = function (title, content, confirmCb, cancelCb, confirmtext, cancelText, noAutoClose) {
  const _this = this
  _this.$vux.confirm.show({
    theme: 'ios',
    title: title || '',
    content: content || '',
    confirmText: confirmtext || '确定',
    cancelText: cancelText || '取消',
    closeOnConfirm: !noAutoClose,
    onCancel() {
      cancelCb ? cancelCb() : null
    },
    onConfirm() {
      confirmCb ? confirmCb() : null
    },
    onShow() {
    },
    onHide() {
    }
  })
}
/* toast */
// [type:'warn'] 1:warn, 2:success, 3:cancel, 4:text
Vue.prototype.toast = function (content, type, position, cb) {
  const _this = this
  switch (type) {
    case 1:
      type = 'warn'
      break
    case 2:
      type = 'success'
      break
    case 3:
      type = 'cancel'
      break
    case 4:
      type = 'text'
      break
    case '':
      type = 'success'
  }
  _this.$vux.toast.show({
    text: content || 'something',
    time: 2000,
    type: type,
    position: position || 'center'
  })
  cb ? cb() : null
  // _this.$vux.toast.text('hello', 'top')
}
Vue.prototype.tips = function (content, duration, cls, cb) {
  weui.topTips(content, {
    duration: duration || 3000,
    className: cls || 'custom-classname',
    callback: function () {
      cb ? cb() : null
    }
  })
}
/* loading */
Vue.prototype.processing = function (content, isClose, cb, timeCb) {
  let _this = this
  if (isClose) {
    _this.$vux.loading.hide()
    return false
  } else {
    _this.$vux.loading.show({
      text: content || ''
    })
    cb ? cb() : null
    setTimeout(function () {
      _this.$vux.loading.hide()
      timeCb ? timeCb() : null
    }, 2000)
  }
}
Vue.prototype.jump = function (name, params, isParams) {
  // 默认按query方式传值,否则为params方式
  var type = !isParams ? 'query' : 'params'
  if (name.indexOf('/') > -1) {
    if (type === 'params') {
      this.$router.push({path: name, params: params || ''})
    } else {
      this.$router.push({path: name, query: params || ''})
    }
  } else {
    if (type === 'params') {
      this.$router.push({name: name, params: params || ''})
    } else {
      this.$router.push({name: name, query: params || ''})
    }
  }
}
/* ----- 封装一些指令 -------- */
// 自定义跳转指令(eg: v-jump="[pathName,paramArr,type]" ,[param是个参数名的数组];[type=2] 1:'path'2:'name',3:'query')
Vue.directive('jump', {
  // el: 指令绑定的元素
  // vm: 拥有该指令的上下文 ViewModel
  // expression: 指令的表达式，不包括参数和过滤器
  // arg: 指令的参数
  // raw: 未被解析的原始表达式
  // name: 不带前缀的指令名
  bind: function (el, binding, vnode) {
    // 做绑定的准备工作（比如添加事件监听器，或是其他只需要执行一次的复杂操作）
    // console.log(arguments)
    let data = binding.value || null
    if (data) {
      let vm = vnode.context
      let pathName = data[0] || null
      let paramArr = data[1] || null
      let type = data[2] || 'name'
      let param = null
      if (paramArr && paramArr.length) {
        param = {}
        for (let i = 0; i < paramArr.length; i++) {
          param[paramArr[i]] = el.getAttribute('data-' + paramArr[i])
        }
      }
      // console.log(pathName, param, type)
      // console.info(param, 'v-jump中的param')
      el.addEventListener('click', function () {
        if (pathName) {
          if (type === 1) {
            // path类型单独处理参数格式
            if (param) {
              var str = []
              for (let j in param) {
                param[j] ? str.push(param[j]) : null
              }
            }
            vm.$router.push({path: '/' + pathName + (param ? '/' + str.join('/') : '')})
          }
          if (type === 2) {
            vm.$router.push({name: pathName, params: param || ''})
          }
          if (type === 3) {
            vm.$router.push({path: '/' + pathName, query: param || ''})
          } else {
            if (pathName.indexOf('/') > -1) {
              vm.$router.push({path: pathName})
            } else {
              vm.$router.push({name: pathName})
            }
          }
        } else {
          console.warn('好歹给个pathName啊！')
        }
      })
    } else {
      console.warn('v-jump似乎还需要点什么！')
    }
  },
  update: function (newValue, oldValue) {
    // 根据获得的新值执行对应的更新（对于初始值也会被调用一次）
  },
  unbind: function () {
    // 做清理工作（比如移除在 bind() 中添加的事件监听器）
    //
  }
})

/* ----- 封装一些过滤器 -------- */
/* 优惠券类型 */
Vue.filter('couponType', function (type) {
  switch (type) {
    case 1:
      return '优惠券'
    case 2:
      return '水票券'
    case 3:
      return '红包'
    case 4:
      return '其它'
  }
})
/* 保留小数位 */
Vue.filter('toFixed', function (data, num) {
  return (data > 0 && parseInt(data) === data) ? data.toFixed(num || 2) : data
})
// main.js
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  created() {
    vm = this
    // 缓存授权信息
    window.youniMall.userAuth = vm.$store.state.global.wxInfo || (me.locals.get('ynWxUser') ? JSON.parse(me.locals.get('ynWxUser')).data : null)
    !vm.$store.state.global.dict ? vm.getDict() : null
  },
  mounted() {
    vm = this
    this.getSeller()
  },
  watch: {
    '$route'(to, from) {
      this.getSeller()
    }
  },
  methods: {
    checkLogin() {
      if (!vm.$store.state.global.isLogin && !me.sessions.get('logYn') && vm.$route.name !== 'login' && vm.$route.name !== 'regist' && vm.$route.name !== 'password') {
        // 检测是否登录
        vm.loadData(commonApi.login, null, 'POST', function (res) {
          if (res.data.success) {
            vm.$store.commit('storeData', {key: 'isLogin', data: true})
            me.sessions.set('logYn', true)
            if (vm.$route.name === 'login' || vm.$route.name === 'regist') {
              vm.$router.push({path: '/home'})
            }
            this.getSeller()
          } else {
            vm.$router.push({path: '/login'})
          }
        }, function () {
        })
      }

      /*/!* 检查登录session是否过期(7天保质期) *!/
       if (isLogin) {
       if (me.getDiffDay(isLogin) > 6) {
       vm.$router.push({path: '/login'})
       }
       } else {
       if (vm.$route.name === 'login' || vm.$route.name === 'regist') return
       vm.$router.push({path: '/login'})
       }*/
    },
    getDict() {
      vm.loadData(commonApi.dict, null, 'POST', function (res) {
        vm.$store.commit('storeData', {key: 'dict', data: res.data.itemList})
      }, function () {
      })
    },
    getSeller() {
      var localSeller = me.sessions.get('ynSellerInfo')
      if (localSeller) {
        vm.$store.commit('storeData', {key: 'userInfo', data: JSON.parse(localSeller)})
        return false
      } else {
        vm.loadData(userApi.get, null, 'POST', function (res) {
          vm.isPosting = false
          if (res.success && res.data) {
            vm.$store.commit('storeData', {key: 'userInfo', data: res.data})
            me.sessions.set('ynSellerInfo', JSON.stringify(res.data))
          }
        })
      }
    }
  }
})
