/* eslint-disable no-unused-vars */
import config from '../config.js'

let host = config.host
/*挂在一些必要的数据到window对象*/
window.youniMall = {
  host: host
}

// if (config.needMock) {
// import '../../mock/mock.js'
// }
// import '../../mock/mock.js'

const homeApi = {
  banner: host + '/home/banner',
  topNotice: host + '/home/topNotice',
  goodsList: host + '/home/goodsList'
}
const goodsApi = {
  list: host + '/goods/list',
  add: host + '/goods/add',
  update: host + '/goods/update',
  saleConfigList: host + '/goods/listSaleConfig',
  setSaleConfig: host + '/goods/setSaleConfig',
  delSaleConfig: host + '/goods/delSaleConfig',
  setSaleStatus: host + '/goods/setSaleStatus'
}
const nearbyApi = {
  shopsList: host + '/home/shopsList'
}
const ticketApi = {
  list: host + '/waterTicket/list',
  add: host + '/waterTicket/add',
  update: host + '/waterTicket/sellerUpdate',
  setSaleStatus: host + '/waterTicket/setSaleStatus'
}
const orderApi = {
  list: host + '/order/list',
  view: host + '/order/view',
  del: host + '/order/del',
  cancel: host + '/order/cancel',
  count: host + '/order/count',
  dispatcher: host + '/orderDispatchProgess/list',
  dispatch: host + '/orderDispatchProgess/add',
  updateOrderStatus: host + '/order/updateOrderStatus'
}
const clientApi = {
  list: host + '/user/list',
  del: host + '/order/del',
  block: host + '/order/block',
  updateOrder: host + '/home/updateOrder',
  depositList: host + '/userDeposit/sellerDepositList'
}
const userApi = {
  get: host + '/seller/get',
  update: host + '/seller/updateSeller',
  set: host + '/seller/set',
  code: host + '/seller/code',
  userInfo: host + '/seller/userInfo',
  getFloor: host + '/floorCost/get',
  addFloor: host + '/floorCost/add'
}
const couponApi = {
  get: host + '/sellerCoupon/get',
  add: host + '/sellerCoupon/add',
  update: host + '/sellerCoupon/update',
  del: host + '/sellerCoupon/del'
}
const assetsApi = {
  asset: host + '/seller/amount',
  withDrawList: host + '/seller/statistic',
  withDraw: host + '/common/top10'
}
const statisticApi = {
  list: host + '/seller/statistic',
  top10: host + '/common/top10',
  orderAnalysis: host + '/common/orderAnalysis',
  saleAnalysis: host + '/common/saleAnalysis',
  puvAnalysis: host + '/common/puvAnalysis'
}
const commonApi = {
  wxAuth: host + '/weixin/auth',
  login: host + '/seller/login',
  logout: host + '/seller/logout',
  regist: host + '/seller/applySeller',
  reset: host + '/seller/setPasswd',
  dict: host + '/common/dictList',
  uploadImg: host + '/file/uploadImage',
  sendSms: host + '/common/sendSms',
  checkCode: host + '/common/checkSmsCode'
}
// console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
// console.log('当前API：%c' + JSON.stringify(homeApi, null, 2), 'color:orange;font-size:14px')
export {commonApi, homeApi, nearbyApi, ticketApi, orderApi, clientApi, couponApi, userApi, goodsApi, assetsApi,statisticApi}
