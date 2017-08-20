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
import '../../mock/mock.js'

const homeApi = {
  banner: host + '/home/banner',
  topNotice: host + '/home/topNotice',
  goodsList: host + '/home/goodsList',
  dict: host + '/common/dictList'
}
const goodsApi = {
  list: host + '/goods/list',
  add: host + '/goods/add',
  update: host + '/goods/update'
}
const nearbyApi = {
  shopsList: host + '/home/shopsList'
}
const ticketApi = {
  tickets: host + '/home/tickets'
}
const orderApi = {
  orders: host + '/home/order',
  updateOrder: host + '/home/updateOrder'
}
const clientApi = {
  list: host + '/home/order',
  updateOrder: host + '/home/updateOrder'
}
const userApi = {
  userInfo: host + '/user/userInfo',
  updateName: host + '/user/updateName',
  login: host + '/seller/login'
}
const statisticApi = {
  list: host + '/seller/statistic',
}
const fileApi = {
  uploadImg: host + '/file/uploadImage'
}
console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
// console.log('当前API：%c' + JSON.stringify(homeApi, null, 2), 'color:orange;font-size:14px')
export {homeApi, nearbyApi, ticketApi, orderApi, clientApi, userApi, goodsApi,statisticApi, fileApi}
