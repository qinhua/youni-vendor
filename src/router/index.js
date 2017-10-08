import Vue from 'vue'
import Router from 'vue-router'
// import App from '@/App'
import Auth from '@/pages/Auth'
import Login from '@/pages/my/Login'
import Home from '@/pages/Home'
import NearBy from '@/pages/NearBy'
import Ticket from '@/pages/Ticket'
import Map from '@/components/Amap'
import Geo from '@/components/Geo'
import My from '@/pages/My'
import EditUser from '@/pages/my/EditUser'
import EditAddress from '@/pages/my/EditAddress'
import MyCoupons from '@/pages/my/Coupons'
import MyGuarantee from '@/pages/my/Guarantee'
import MyAddress from '@/pages/my/Address'
import MyFavorite from '@/pages/my/Favorite'
import Help from '@/pages/my/Help'
import Rules from '@/pages/my/Rules'
import About from '@/pages/my/About'
import Audit from '@/pages/my/Audit'
import GoodsDetail from '@/pages/goods/Detail'
import GoodsSearch from '@/components/GoodsSearch'

import StoreItems from '@/pages/store/Items'
import Topic from '@/pages/store/topic/Topic'
import Coupons from '@/pages/store/coupons/Coupons'
import EditCoupon from '@/pages/store/coupons/Edit'
import FloorFee from '@/pages/store/floor/FloorFee'
import DispatchTime from '@/pages/store/dispatch/time'
import GuaranteeFee from '@/pages/store/guarantee/GuaranteeFee'

import GoodsItems from '@/pages/goods/Items'
import Goods from '@/pages/goods/goods/Goods'
import OrderDetail from '@/pages/orders/Detail'
import EditGoods from '@/pages/goods/goods/Edit'
import EditSubPrice from '@/components/EditSubPrice'
import Tickets from '@/pages/goods/tickets/Tickets'
import EditTicket from '@/pages/goods/tickets/Edit'

import Clients from '@/pages/clients/Clients'
import Assets from '@/pages/assets/Assets'
import Income from '@/pages/assets/income/Income'
import WithDrawList from '@/pages/assets/withDraw/WithDrawList'
import WithDraw from '@/pages/assets/withDraw/WithDraw'
import Statistic from '@/pages/statistic/Statistic'
// import Regist from '@/pages/my/Regist'
import Regist from '@/pages/my/Regist-new'
import Password from '@/pages/my/Password'

import NoPage from '@/pages/NoPage'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
Vue.use(Router)

export default new Router({
  // mode: '',
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  },
  routes: [
    {
      path: '/author',
      name: 'author',
      component: Auth,
      meta: {
        title: '授权中…',
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
      path: '/home/:status',
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
      path: '/password',
      name: 'password',
      component: Password,
      meta: {
        title: '修改密码',
        keepAlive: false
      }
    },
    {
      path: '/store_items',
      name: 'store_items',
      component: StoreItems,
      meta: {
        title: '店铺管理',
        keepAlive: false
      }
    },
    {
      path: '/store_topic',
      name: 'store_topic',
      component: Topic,
      meta: {
        title: '店铺公告',
        keepAlive: false
      }
    },
    {
      path: '/coupons',
      name: 'coupons',
      component: Coupons,
      meta: {
        title: '优惠管理',
        keepAlive: false
      }
    },
    {
      path: '/edit_coupon',
      name: 'edit_coupon',
      component: EditCoupon,
      meta: {
        title: '优惠编辑',
        keepAlive: false
      }
    },
    {
      path: '/floor_fee',
      name: 'floor_fee',
      component: FloorFee,
      meta: {
        title: '上楼费',
        keepAlive: false
      }
    },
    {
      path: '/guarantee_fee',
      name: 'guarantee_fee',
      component: GuaranteeFee,
      meta: {
        title: '保证金',
        keepAlive: false
      }
    },
    {
      path: '/dispatch_time',
      name: 'dispatch_time',
      component: DispatchTime,
      meta: {
        title: '派送时间',
        keepAlive: false
      }
    },
    {
      path: '/goods_items',
      name: 'goods_items',
      component: GoodsItems,
      meta: {
        title: '商品管理',
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
      path: '/order_detail',
      name: 'order_detail',
      component: OrderDetail,
      meta: {
        title: '订单详情',
        keepAlive: false
      }
    },
    {
      path: '/edit_sub_price',
      name: 'edit_sub_price',
      component: EditSubPrice,
      meta: {
        title: '价格标签',
        keepAlive: false
      }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Tickets,
      meta: {
        title: '水票管理',
        keepAlive: false
      }
    },
    {
      path: '/edit_ticket',
      name: 'edit_ticket',
      component: EditTicket,
      meta: {
        title: '编辑水票',
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
      path: '/assets',
      name: 'assets',
      component: Assets,
      meta: {
        title: '资金管理',
        keepAlive: false
      }
    },
    {
      path: '/income_list',
      name: 'income_list',
      component: Income,
      meta: {
        title: '收支明细',
        keepAlive: false
      }
    },
    {
      path: '/with_draw',
      name: 'with_draw',
      component: WithDraw,
      meta: {
        title: '提现',
        keepAlive: false
      }
    },
    {
      path: '/with_draw_list',
      name: 'with_draw_list',
      component: WithDrawList,
      meta: {
        title: '提现记录',
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
      path: '/rules',
      name: 'rules',
      component: Rules,
      meta: {
        title: '商家协议',
        keepAlive: false
      }
    },
    {
      path: '/audit',
      name: 'audit',
      component: Audit,
      meta: {
        title: '审核中',
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
      path: '/geo',
      name: 'geo',
      component: Geo,
      meta: {
        title: '当前位置',
        keepAlive: false
      }
    },
    {
      path: '/goods_search',
      name: 'goods_search',
      component: GoodsSearch,
      meta: {
        title: '商品列表',
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
