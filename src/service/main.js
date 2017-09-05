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
  setSaleStatus: host + '/goods/setSaleStatus'
}
const nearbyApi = {
  shopsList: host + '/home/shopsList'
}
const ticketApi = {
  tickets: host + '/home/tickets'
}
const orderApi = {
  list: host + '/order/list',
  updateOrder: host + '/home/updateOrder'
}
const clientApi = {
  list: host + '/home/order',
  updateOrder: host + '/home/updateOrder'
}
const userApi = {
  login: host + '/seller/login',
  regist: host + '/seller/applySeller',
  view: host + '/seller/view',
  code: host + '/seller/code',
  userInfo: host + '/seller/userInfo',
  updateSeller: host + '/seller/updateSeller',
  coupons: host + '/user/coupons'
}
const statisticApi = {
  list: host + '/seller/statistic',
}
const commonApi = {
  dict: host + '/common/dictList',
  uploadImg: host + '/file/uploadImage',
  sendSms: host + '/common/sendSms',
  checkCode: host + '/common/checkSmsCode'
}
console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
// console.log('当前API：%c' + JSON.stringify(homeApi, null, 2), 'color:orange;font-size:14px')
export {commonApi, homeApi, nearbyApi, ticketApi, orderApi, clientApi, userApi, goodsApi,statisticApi}
