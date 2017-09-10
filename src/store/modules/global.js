export default {

  state: {
    name: '全局',
    isLogin:false,
    geoData: null,
    expired: true,
    wxInfo: null,
    // expired: false,
    // wxInfo: {
    //   'city': '武汉',
    //   'country': '中国',
    //   'errorCode': 0,
    //   'errorMessage': null,
    //   'headimgurl': 'http://wx.qlogo.cn/mmopen/QAm7hEbaujS41jY5T0icQd9ySS9FaRJibTiclJGyysBmLoFmswkhLemAHAibYOQml4hibx3BqD2u8NRIwrAhTyeLgjavI70oxia8uk/0',
    //   'nickname': '覃华',
    //   // 'openid': 'oEo51t1PTVGj7H6Ahdqr_kac-1vs',
    //   'openid': 'oGnE80ixTvBXjQ_Dql0BcTlx',
    //   'privilege': [],
    //   'province': '湖北',
    //   'sex': '1',
    //   'subscribe': 0,
    //   'subscribeTime': null,
    //   'unionid': null
    // },
    dict: [
      {
        "dictType": "business_status",
        "description": "店铺营业状态",
        "items": [
          {
            "value": "business_status.1",
            "label": "营业"
          },
          {
            "value": "business_status.2",
            "label": "不营业"
          }
        ]
      },
      {
        "dictType": "seller_type",
        "description": "店铺服务类型",
        "items": [
          {
            "value": "seller_service_type.1",
            "label": "水"
          },
          {
            "value": "seller_service_type.2",
            "label": "奶"
          },
          {
            "value": "seller_service_type.3",
            "label": "全部"
          }
        ]
      },
      {
        "dictType": "goods_category",
        "description": "商品类目",
        "items": [
          {
            "value": "goods_category.1",
            "label": "瓶装"
          },
          {
            "value": "goods_category.2",
            "label": "桶装"
          },
          {
            "value": "goods_category.3",
            "label": "其它"
          }
        ]
      },
      {
        "dictType": "seller_level",
        "description": "店铺级别",
        "items": [
          {
            "value": "seller_level.1",
            "label": "普通"
          },
          {
            "value": "seller_level.2",
            "label": "官方认证"
          },
          {
            "value": "seller_level.3",
            "label": "金牌店"
          }
        ]
      },
      {
        "dictType": "goods_type",
        "description": "商品分类",
        "items": [
          {
            "value": "goods_type.1",
            "label": "水"
          },
          {
            "value": "goods_type.2",
            "label": "奶"
          },
          {
            "value": "goods_type.3",
            "label": "水票"
          }
        ]
      },
      {
        "dictType": "order_type",
        "description": "商品类型",
        "items": [
          {
            "value": "order_type.1",
            "label": "即时单"
          },
          {
            "value": "order_type.2",
            "label": "预定单"
          }
        ]
      },
      {
        "dictType": "water_ticket_type",
        "description": "水票类型",
        "items": [
          {
            "value": "water_ticket_type.1",
            "label": "买5送1"
          },
          {
            "value": "water_ticket_type.2",
            "label": "买10送2"
          },
          {
            "value": "water_ticket_type.3",
            "label": "买100送30"
          },
          {
            "value": "water_ticket_type.4",
            "label": "买100送35"
          },
          {
            "value": "water_ticket_type.5",
            "label": "买100送40"
          }
        ]
      }
    ],
    direction: 'forward'
  },

  getters: {
    /*getSth: ()=> {
      return state.name
    }*/
  },

  mutations: {
    getFromDict(state, type) {
      setTimeout(function () {
        for (var i = 0; i < state.dict.length; i++) {
          var cur = state.dict[i]
          if (cur.dictType === type) {
            console.log(cur.items)
            return cur.items
          }
        }
      }, 2000)
    },
    getData(state, payload) {
      if (payload.res.httpStatusCode === 200) {
        state.itemDetail = payload.res.topiclist
      }
    },
    storeData(state, response) {
      state[response['key']] = response.data
    },
    logout(state) {
      state.wxInfo = null
    },
    /* 更新路由方向 */
    updateDirection(state, payload) {
      state.direction = payload.direction
    },
    updateStore(state, payload) {
      state.store = payload
    }
  },

  actions: {
    /*checkData ({commit, state}, id) {
      commit('getData', { id })
      if (!state.wxInfo) {
        commit('storeData', {
          key:'wxInfo'
          data: {}
        })
      }
    }*/
  }

}
