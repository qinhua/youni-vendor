import Vue from 'vue'
import Router from 'vue-router'
// import App from '@/App'
import Auth from '@/pages/Auth'
import Login from '@/pages/my/Login'
import Home from '@/pages/Home'
import NearBy from '@/pages/NearBy'
import Ticket from '@/pages/Ticket'
import Order from '@/pages/Order'
import Map from '@/pages/Map'
import My from '@/pages/My'
import EditUser from '@/pages/my/EditUser'
import EditAddress from '@/pages/my/EditAddress'
import MyCoupons from '@/pages/my/Coupons'
import MyGuarantee from '@/pages/my/Guarantee'
import MyAddress from '@/pages/my/Address'
import MyFavorite from '@/pages/my/Favorite'
import Help from '@/pages/my/Help'
import About from '@/pages/my/About'
import GoodsDetail from '@/pages/goods/Detail'

import Store from '@/pages/store/Store'
import Goods from '@/pages/goods/Goods'
import EditGoods from '@/pages/goods/Edit'
import Clients from '@/pages/clients/Clients'
import Statistic from '@/pages/statistic/Statistic'
import Regist from '@/pages/my/Regist'

import NoPage from '@/pages/NoPage'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
Vue.use(Router)

export default new Router({
  // mode: '',
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  },
  routes: [
    {
      path: '/author',
      name: 'author',
      component: Auth,
      meta: {
        title: '微信授权',
        keepAlive: false // 是否需要缓存
      }
    },
    {
      path: '/regist',
      name: 'regist',
      component: Regist,
      meta: {
        title: '商家入驻',
        keepAlive: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
        keepAlive: false
      }
    },
    {
      path: '/',
      name: '/',
      redirect: '/home',
      component: Home,
      meta: {
        title: '我的小店',
        keepAlive: false
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: '我的小店',
        keepAlive: false
      }
    },
    {
      path: '/nearby',
      name: 'nearby',
      component: NearBy,
      meta: {
        title: '附近',
        keepAlive: false
      }
    },
    {
      path: '/ticket',
      name: 'ticket',
      component: Ticket,
      meta: {
        title: '水票',
        keepAlive: false
      }
    },
    {
      path: '/ticket/:type',
      name: 'ticket',
      component: Ticket,
      meta: {
        title: '水票',
        keepAlive: false
      }
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      meta: {
        title: '订单',
        keepAlive: false
      }
    },
    {
      path: '/user',
      name: 'user',
      component: My,
      meta: {
        title: '我的',
        keepAlive: false
      }
      /* children: [{
       path: '/myaddress',
       name: '我的地址',
       component: MyAddress
       }] */
    },
    {
      path: '/edit_user',
      name: 'edit_user',
      component: EditUser,
      meta: {
        title: '我的',
        keepAlive: false
      }
    },
    {
      path: '/store',
      name: 'store',
      component: Store,
      meta: {
        title: '店铺管理',
        keepAlive: false
      }
    },
    {
      path: '/goods',
      name: 'goods',
      component: Goods,
      meta: {
        title: '商品管理',
        keepAlive: false
      }
    },
    {
      path: '/edit_goods',
      name: 'edit_goods',
      component: EditGoods,
      meta: {
        title: '编辑商品',
        keepAlive: false
      }
    },
    {
      path: '/clients',
      name: 'clients',
      component: Clients,
      meta: {
        title: '客户管理',
        keepAlive: false
      }
    },
    {
      path: '/statistic',
      name: 'statistic',
      component: Statistic,
      meta: {
        title: '数据统计',
        keepAlive: false
      }
    },
    {
      path: '/mycoupons',
      name: 'mycoupons',
      component: MyCoupons,
      meta: {
        title: '我的卡券',
        keepAlive: false
      }
    },
    {
      path: '/myguarantee',
      name: 'myguarantee',
      component: MyGuarantee,
      meta: {
        title: '我的押金',
        keepAlive: false
      }
    },
    {
      path: '/myaddress',
      name: 'myaddress',
      component: MyAddress,
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    {
      path: '/edit_address',
      name: 'edit_address',
      component: EditAddress,
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    {
      path: '/myfavor',
      name: 'myfavor',
      component: MyFavorite,
      meta: {
        title: '我的收藏',
        keepAlive: false
      }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: {
        title: '使用帮助',
        keepAlive: false
      }
    },
    {
      path: '/aboutus',
      name: 'aboutus',
      component: About,
      meta: {
        title: '关于友你',
        keepAlive: false
      }
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
      meta: {
        title: '地图',
        keepAlive: false
      }
    },
    {
      path: '/goods_detail',
      name: 'goods_detail',
      component: GoodsDetail,
      meta: {
        title: '商品详情',
        keepAlive: false
      }
    },
    {
      path: '*',
      name: '404',
      component: NoPage,
      meta: {
        title: '迷路了',
        keepAlive: true
      }
    }
  ]
})
