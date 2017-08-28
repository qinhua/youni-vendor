<template>
  <div class="home-con" ref="home" v-cloak>
    <geo :visible="false" @on-geo-end="getMap"></geo>
    <!--banner-->
    <!-- <div class="swiper-home">
       <swiper ref="slider01" skey="s01" :slides="banner" autoPlay="2500"></swiper>
     </div>-->
    <div class="overview">
      <a href="#/user"><i class="fa fa-user-circle-o user-center"></i></a>
      <div class="top">
        <p class="today">今日收入(元)</p>
        <h2>
          <countup :start-val="0" :end-val="120500" :decimals="2" :duration="2"></countup>
        </h2>
        <p class="yesterday">昨日：10.00</p>
      </div>
      <div class="bottom">
        <div class="col left-col">
          <p class="today">成交数</p>
          <h2 class="total">1105</h2>
          <p class="yesterday">昨日25</p>
        </div>
        <div class="col right-col">
          <p class="today">浏览数</p>
          <h2 class="total">2020</h2>
          <p class="yesterday">昨日1550</p>
        </div>
      </div>
    </div>

    <!--中间入口-->
    <div class="middle-entry">
      <grid :rows="5">
        <grid-item label="商品管理" link="/goods">
          <img slot="icon" src="../../static/img/item_goods.png">
        </grid-item>
        <grid-item label="店铺管理" link="/store">
          <img slot="icon" src="../../static/img/item_store.png">
        </grid-item>
        <grid-item label="客户管理" link="/clients">
          <img slot="icon" src="../../static/img/item_client.png">
        </grid-item>
        <grid-item label="资金管理" link="/assets">
          <img slot="icon" src="../../static/img/item_assets.png">
        </grid-item>
        <grid-item label="统计数据" link="/statistic">
          <img slot="icon" src="../../static/img/item_statistic.png">
        </grid-item>
      </grid>
      <!--<div class="top-notice" v-if="notice.length">
        <div class="inner">
          <div class="ico ico-toutiao"></div>
          <marquee>
            <marquee-item v-for="(news, i) in notice" :key="i" :data-id="news.noticeId"
                          @click.native="toTopic(news.linkUrl)"
                          class="align-middle">{{news.content}}
            </marquee-item>
          </marquee>
        </div>
      </div>-->
    </div>
    <group>
      <x-switch :title="'订单类别 ['+(isMilk?'奶':'水')+']'" v-model="isMilk" @on-click="changeType"></x-switch>
    </group>
    <!--订单列表-->
    <div class="orders-list-con">
      <sticky ref="sticky">
        <tab class="order-tab" ref="orderTab" active-color="#FE6246" v-if="!isMilk">
          <tab-item :selected="type==0?true:false" @on-item-click="onItemClick">全部</tab-item>
          <tab-item :selected="type==1?true:false" @on-item-click="onItemClick(1)">待支付</tab-item>
          <tab-item :selected="type==2?true:false" @on-item-click="onItemClick(2)">待派送</tab-item>
          <tab-item :selected="type==3?true:false" @on-item-click="onItemClick(3)">待评价</tab-item>
          <tab-item :selected="type==4?true:false" @on-item-click="onItemClick(4)">已完成</tab-item>
        </tab>
        <tab class="order-tab" ref="orderTab" active-color="#FE6246" v-else>
          <tab-item :selected="type==0?true:false" @on-item-click="onItemClick">全部</tab-item>
          <tab-item :selected="type==1?true:false" @on-item-click="onItemClick(1)">配送中</tab-item>
          <tab-item :selected="type==2?true:false" @on-item-click="onItemClick(2)">已暂停</tab-item>
          <tab-item :selected="type==4?true:false" @on-item-click="onItemClick(4)">已完成</tab-item>
        </tab>
      </sticky>
      <div :class="'order-list' + (orders.length?' hasContent':'')">
        <scroller class="inner-scroller" ref="orderScroller" :on-refresh="refresh" :on-infinite="infinite"
                  refreshText="下拉刷新" noDataText="没有更多数据" snapping v-if="!isMilk">
          <!-- content goes here -->
          <section class="v-items" v-for="(item, index) in orders" :data-id="item.id"
                   :data-orderNumber="item.orderNumber">
            <!--<h4 class="item-top"><i class="ico-store"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i
              class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>-->
            <section class="item-middle">
              <div class="img-con">
                <img :src="item.imgurl">
              </div>
              <div class="info-con">
                <h3>{{item.productName}}</h3>
                <section class="middle">
                  <span class="unit-price">￥{{item.unitPrice}}</span>
                  <span class="order-info">{{item.info}}</span>
                </section>
                <label>{{item.label}}</label>
              </div>
              <div class="price-con">
                <p class="price">￥{{item.price}}</p>
                <p class="buy-count">x{{item.buyCount}}</p>
              </div>
            </section>
            <section class="item-bottom">
              <div class="extra-info">
                <p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span>
                </p>
              </div>
              <div class="total-price">共{{item.buyCount}}件商品&nbsp;合计：<span>￥{{item.total}}</span>.00（含上楼费）</div>
              <div class="btns" v-if="item.status===-1">
                <a class="btn btn-del" @click="delOrder(item.orderId||2)">删除订单</a>
              </div>
              <!--<div class="btns" v-if="item.status===0">
                <a class="btn btn-pay" @click="payOrder(item.orderId||2)">支付</a>
                <a class="btn btn-cancel" @click="cancelOrder(item.orderId||2)">取消订单</a>
              </div>-->
              <div class="btns" v-if="item.status===1">
                <a class="btn btn-cancel" @click="cancelOrder(item.orderId||2)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===2">
                <a class="btn btn-cancel" @click="cancelOrder(item.orderId||2)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===3">
                <a class="btn btn-appraise" @click="toAppraise(item.orderId||2)">评价</a>
                <a class="btn btn-del" @click="delOrder(item.orderId||2)">删除订单</a>
              </div>
              <div class="btns" v-if="item.status===4">
                <a class="btn btn-del" @click="delOrder(item.orderId||2)">删除订单</a>
              </div>
            </section>
          </section>
        </scroller>

        <scroller class="inner-scroller" ref="orderScroller" :on-refresh="refresh" :on-infinite="infinite"
                  refreshText="下拉刷新" noDataText="没有更多数据" snapping v-else>
          <!-- content goes here -->
          <section class="v-items" v-for="(item, index) in orders" :data-id="item.id"
                   :data-orderNumber="item.orderNumber">
            <h4 class="item-top"><i class="fa fa-address-card"></i>&nbsp;王亮的订单&nbsp;&nbsp;<i
              class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>
            <section class="item-middle">
              <div class="img-con">
                <img :src="item.imgurl">
              </div>
              <div class="info-con">
                <h3>{{item.productName}}</h3>
                <section class="middle">
                  <span class="unit-price">￥{{item.unitPrice}}</span>
                  <span class="order-info">{{item.info}}</span>
                </section>
                <label class="progress"><span>已送：5次</span>&nbsp;&nbsp;<span>待送：13次</span></label>
              </div>
              <div class="price-con">
                <p class="price">￥{{item.price}}</p>
                <p class="buy-count">x{{item.buyCount}}</p>
              </div>
            </section>
            <section class="item-bottom">
              <div class="extra-info">
                <p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span>
                </p>
              </div>
              <div class="total-price">共{{item.buyCount}}件商品&nbsp;合计：<span>￥{{item.total}}</span>.00（含上楼费）</div>
              <div class="btns" v-if="item.status===-1">
                <a class="btn btn-del" @click="delOrder(item.orderId||2)">删除订单</a>
              </div>
              <!--<div class="btns" v-if="item.status===0">
                <a class="btn btn-pay" @click="payOrder(item.orderId||2)">支付</a>
                <a class="btn btn-cancel" @click="cancelOrder(item.orderId||2)">取消订单</a>
              </div>-->
              <div class="btns" v-if="item.status===1">
                <a class="btn btn-cancel" @click="cancelOrder(item.orderId||2)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===2">
                <a class="btn btn-del" @click="delOrder(item.orderId||2)">恢复配送</a>
                <a class="btn btn-cancel" @click="cancelOrder(item.orderId||2)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===3">
                <a class="btn btn-appraise" @click="toAppraise(item.orderId||2)">评价</a>
                <a class="btn btn-del" @click="delOrder(item.orderId||2)">删除订单</a>
              </div>
              <div class="btns" v-if="item.status===4">
                <a class="btn btn-del" @click="delOrder(item.orderId||2)">删除订单</a>
              </div>
            </section>
          </section>
        </scroller>
      </div>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import Swiper from '../components/Swiper'
  import Geo from '../components/Geo'
  import {
    Group,
    GroupTitle,
    Grid,
    GridItem,
    Marquee,
    MarqueeItem,
    Countup,
    Tab,
    TabItem,
    XSwitch,
    Sticky
  } from 'vux'
  import {homeApi, orderApi, goodsApi} from '../service/main.js'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'home',
    data() {
      return {
        geo: {},
        isMilk: true,
        location: '',
        type: 0,
        banner: [],
        notice: [],
        orders: [],
        showList: true,
        scrollTop: 0,
        onFetching: false,
        pulldownConfig: {
          content: '下拉刷新',
          height: 60,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '松开以加载',
          loadingContent: '加载中…',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        pullupConfig: {
          content: '上滑加载更多',
          height: 40,
          pullUpHeight: 60,
          autoRefresh: false,
          downContent: '上滑加载',
          upContent: '上滑加载',
          loadingContent: '加载中…',
          clsPrefix: 'xs-plugin-pullup-'
        },
        curOrderFilter: ''
      }
    },
    components: {
      Geo,
      Group,
      GroupTitle,
      Grid,
      GridItem,
      Marquee,
      MarqueeItem,
      Countup,
      Tab,
      TabItem,
      XSwitch,
      Sticky
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      me.attachClick()
      // this.count = this.$store.state.cart.count
      // vm.getPos()
      // vm.getBanner()
      // vm.getNotice()
      vm.getOrders()
      vm.$nextTick(function () {
        vm.$nextTick(function () {
          vm.$refs.orderScroller.finishInfinite(true)
          vm.$refs.orderScroller.resize()
        })
      })
    },
    computed: {
      curType() {
        return vm.isMilk ? 'milk' : 'water'
      }
    },
    watch: {
//      '$route'(to, from) {
//        vm.getPos()
//      }
      isMilk() {
        vm.getOrders()
      }
    },
    methods: {
      // 全局定位
      getMap(data) {
        console.log(data, 'home geo info')
        vm.geo = {}
        if (data.type === 'complete') {
          vm.geo = {
            success: true,
            responseText: '定位成功',
            province: data.addressComponent ? data.addressComponent.province : '',
            city: data.addressComponent ? data.addressComponent.city : '',
            cityCode: data.addressComponent ? data.addressComponent.adcode : '',
            provinceCode: data.addressComponent ? data.addressComponent.citycode : '',
            lat: data.position.lat,
            lng: data.position.lng,
            address: data.formattedAddress || ''
          }
          vm.$store.commit('storeGeo', vm.geo)
        } else {
          vm.geo = {
            success: false,
            responseText: '定位失败'
          }
        }
      },
      getPos() {
        var lp = me.locals.get('cur5656Position')
        setTimeout(function () {
          if (lp) {
            vm.location = JSON.parse(lp).name || JSON.parse(lp).formattedAddress
          } else {
            try {
              vm.location = '定位中…'
              var map, geolocation;
              // 加载地图，调用浏览器定位服务
              map = new AMap.Map('mapContainer', {
                resizeEnable: true
              });
              map.plugin('AMap.Geolocation', function () {
                geolocation = new AMap.Geolocation({
                  enableHighAccuracy: true,//是否使用高精度定位，默认:true
                  timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                  buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                  zoomToAccuracy: true,  //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  buttonPosition: 'RB'
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
              });

              // 解析定位结果
              function onComplete(data) {
                me.locals.set('cur5656Position', JSON.stringify(data))
                vm.location = data.formattedAddress
                var str = ['定位成功'];
                str.push('经度：' + data.position.getLng());
                str.push('纬度：' + data.position.getLat());
                if (data.accuracy) {
                  str.push('精度：' + data.accuracy + ' 米');
                }
                // 如为IP精确定位结果则没有精度信息
                str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
                // document.getElementById('tip').innerHTML = str.join('<br>');
              }

              // 解析定位错误信息
              function onError(data) {
                vm.location = '定位失败'
                // document.getElementById('tip').innerHTML = '定位失败';
              }
            } catch (e) {
              console.log(e)
            }
          }
        }, 800)
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      scrollHandler() {
        // 监听dom的scroll事件
        setTimeout(function () {
          let scrollTop = vm.$refs.home.scrollTop
          let target = vm.$refs.orderTab
          let list = vm.$refs.goodsList
          if (vm.showFilterCon) {
            vm.hideFilter()
          }
          if (scrollTop >= vm.orderOffset) {
            target.classList.add('fixed')
            list.classList.add('fixed')
          } else {
            target.classList.remove('fixed')
            list.classList.remove('fixed')
          }
        }, 300)
      },
      toMap() {
        vm.$router.push({name: 'map', params: {path: vm.$route.path.replace(/\//g, '_')}})
      },
      toTopic(url) {
        if (vm.showFilterCon) return
        location.href = url
      },
      toDetail(id) {
        if (vm.showFilterCon) return
        vm.$router.push({path: '/detail/' + id})
      },
      /* 页面数据 */
      getBanner(cb) {
        vm.loadData(homeApi.banner, null, 'POST', function (res) {
          console.log(res.data, '首页Banner')
          vm.banner = res.data.itemList
          cb ? cb() : null
        })
      },
      getNotice() {
        vm.loadData(homeApi.topNotice, null, 'POST', function (res) {
          console.log(res.data, '首页TopNews')
          vm.notice = res.data.itemList
        })
      },
      /* 商品筛选 */
      showFilter(type, e) {
        vm.factive = type
        console.log(vm.subActive)
        if (vm.showFilterCon) {
          if (vm.curFilterType === type) {
            vm.factive = ''
            vm.showFilterCon = false
          } else {
            vm.curFilterType = type
            vm.currentFilter = vm.filters[type]
            vm.showFilterCon = true
          }
        } else {
          vm.curFilterType = type
          vm.currentFilter = vm.filters[type]
          vm.showFilterCon = true
        }
        // 默认选中已选择的筛选条件
      },
      hideFilter() {
        if (vm.showFilterCon) {
          vm.showFilterCon = false
          vm.factive = ''
        }
      },
      chooseFilter(idx, key, value, e) {
        vm.goods = []
        console.log(JSON.stringify(vm.filterData), vm.curFilterType)
        if (JSON.stringify(vm.filterData).indexOf(vm.curFilterType) === -1) {
          vm.filterData.push({
            type: vm.curFilterType,
            filterId: key,
            filterName: value !== '全部' ? value : ''
          })
        } else {
          for (var i = 0; i < vm.filterData.length; i++) {
            console.log(vm.filterData[i].filterName, value)
            if (vm.filterData[i].filterName !== value) {
              vm.filterData[i] = {
                type: vm.curFilterType,
                filterId: key,
                filterName: value !== '全部' ? value : ''
              }
            }
          }
        }
        vm.factive = ''
        vm.showFilterCon = false
        console.log(vm.filterData, '最后的筛选数据')
        var lastF = {
          goodsType: 1,
          goodsCategory: 'water',
          brandId: 2,
          filter: '有折扣，有满减'
        }
        vm.getGoods(lastF)
      },
      changeType() {
        vm.getOrders()
      },
      /* 上下拉刷新 */
      onPullDown() {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          // this.onFetching = true
          setTimeout(function () {
            vm.getGoods()
            vm.$nextTick(function () {
              vm.$refs.myScroll.reset({top: 0})
              vm.$refs.myScroll.donePullup()
              vm.$refs.myScroll.donePulldown()
            })
          }, 1500)
        }
      },
      onPullUp() {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          /* if(vm.$refs.myScroll.top<500){
           return
           } */
          // vm.onFetching = true
          setTimeout(function () {
            vm.getGoods(true)
            vm.$nextTick(function () {
              vm.$refs.myScroll.reset({bottom: 0})
              vm.$refs.myScroll.donePullup()
              vm.$refs.myScroll.donePulldown()
            })
          }, 200)
        }
      },
      onScroll(pos) {
        this.scrollTop = pos.top
        vm.factive = ''
        vm.showFilterCon ? vm.showFilterCon = false : null
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getOrders()
          vm.$refs.orderScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getOrders(true)
          vm.$refs.orderScroller.finishInfinite(true)
        }, 1000)
      },
      getOrders(isLoadMore,status) {
        if (vm.onFetching) return false
        var params = {
          type: 0,
          pagerSize: 10,
          pageNo: 1,
          goodsType: vm.curType || 'water',
          goodsCategory: '',
          brandId: '',
          filter: ''
        }
        vm.processing()
        vm.onFetching = true
        vm.loadData(orderApi.list, params, 'POST', function (res) {
          var resD = res.data.pager.itemList
          for (var i = 0; i < resD.length; i++) {
            switch (resD[i].status) {
              case -1:
                resD[i].statusName = '已取消'
                break
              case 0:
                resD[i].statusName = '待支付'
                break
              case 1:
                resD[i].statusName = '待派送'
                break
              case 2:
                resD[i].statusName = '派送中'
                break
              case 3:
                resD[i].statusName = '待评价'
                break
              case 4:
                resD[i].statusName = '已完成'
                break
            }
          }
          if (!isLoadMore) {
            vm.orders = resD
          } else {
            vm.orders.push(resD)
          }
          console.log(vm.orders, '订单数据')
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      delOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.delOrder + '?id=' + id, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      cancelOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认取消？', '订单取消后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.cancelOrder + '?id=' + id, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      pushOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认催单？', '请不要频繁催单！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.cancelOrder + '?id=' + id, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      onItemClick(type) {
        if (type === 'undefined') {
          vm.type = ''
        } else {
          vm.type = type
        }
        vm.getOrders()
      },
      changeCount(obj) {
        console.log(obj)
        if (obj.type === 'add') {
          this.additem(obj.event)
          this.count++
        } else if (obj.type === 'sub') {
          this.count--
        } else {
          this.count = obj.value
        }
        vm.$store.commit('updateCart', this.count)
        console.log(vm.$store.state.cart.count)
      },
      /* 购物车 */
      additem(event) {
        this.drop(event.target);
      },
      /* 购物车小球动画 */
      drop(el) {
        //抛物
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return;
          }
        }
      },
      beforeDrop(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect() //元素相对于视口的位置
            let x = rect.left - 40
            let y = -(window.innerHeight - rect.top - 22) //获取y
            el.style.display = ''
            el.style.webkitTransform = 'translateY(' + y + 'px)' //translateY
            el.style.transform = 'translateY(' + y + 'px)'
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = 'translateX(' + x + 'px)'
            inner.style.transform = 'translateX(' + x + 'px)'
          }
        }
      },
      /*重置小球数量  样式重置*/
      dropping(el, done) {
        let rf = el.offsetHeight
        let cartCls = vm.$refs.floatCart.classList
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(-10px,-80px,0)'
        inner.style.transform = 'translate3d(-10px,-80px,0)'
        el.addEventListener('transitionend', done)
        cartCls.toggle('bulbing')
        setTimeout(function () {
          cartCls.remove('bulbing')
        }, 800)
      },
      /*初始化小球*/
      afterDrop(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .home-con {
    height: 100%;
    overflow-y: scroll; // 此两个属性至关重要，不写@scroll监听不到滚动
  }

  .location-chooser {
    .rel;
    .borBox;
    padding: 0 40/@rem 0 20/@rem;
    height: 80/@rem;
    line-height: 80/@rem;
    .bf5;
    p {
      .fz(24);
      .c6;
      .ellipsis;
      span {
        .cdiy(#f34c18);
      }
    }
    .right-arrow {
      .abs-center-vertical;
    }
  }

  .orders-list-con {
  }

  .swiper-home {
    min-height: 320/@rem;
    margin-bottom: 10/@rem;
    .swiper-container {
      /*p {
        padding: 10/@rem 20/@rem;
        .b3;
        .cf;
      }*/
      .swiper-pagination {
        bottom: 5px;
      }
      .swiper-pagination-bullet-active {
        background: #eee;
      }
    }
  }

  .overview {
    .rel;
    .borBox;
    padding: 30/@rem 30/@rem 20/@rem;
    .cf;
    .bdiy(#FE6246);
    .user-center {
      .abs;
      left: 0;
      top: 0;
      padding: 30/@rem;
      .fz(40);
      .cf;
    }
    .top {
      padding: 40/@rem 0;
      .center;
      //      .bor-b;
      .bor-b(1px, solid, rgba(255, 255, 255, .2));
      h2 {
        padding: 30/@rem 0;
        line-height: 1;
        //        .c3;
        .fz(60);
      }
      .today {
        //        .c6;
        .fz(30);
      }
      .yesterday {
        //        .c9;
        .fz(24);
      }
    }
    .bottom {
      padding-top: 20/@rem;
      .center;
      overflow: hidden;
      .col {
        .fl;
        width: 50%;
      }
      h2 {
        padding: 18/@rem 0;
        line-height: 1;
        .txt-normal;
        //        .c3;
        .fz(36);
      }
      .today {
        //        .c3;
        .fz(24);
      }
      .yesterday {
        //        .c9;
        .fz(20);
      }
    }
  }

  .middle-entry {
    margin-bottom: 10/@rem;
    .bf;
    /*border-top: 1px solid #eee;*/
    border-bottom: 1px solid #eee;
    .weui-grid__icon {
      display: block;
      .size(80, 80);
    }
    .weui-grid__label {
      .fz(24);
    }
    .weui-grids {
      &:before, &:after {
        .none;
      }
    }
    .weui-grid {
      .pointer;
      &:before, &:after {
        .none;
      }
    }
    .top-notice {
      padding-bottom: 10/@rem;
      .inner {
        .rel;
        width: 94%;
        height: 20px;
        .ma;
        padding: 20/@rem 0;
        .bor-t;
      }
      .ico-toutiao {
        .abs-center-vertical;
        left: 10/@rem;
        .size(54, 54);
        background: url(../../static/img/ico_toutiao.png) center;
        .ele-base;
      }
      .vux-marquee {
        .borBox;
        padding-left: 120/@rem;
        &:before {
          .abs;
          margin-left: -30/@rem;
          content: "";
          position: absolute;
          width: 1px;
          height: 20px;
          background: #eee;
        }
        li {
          .ellipsis;
        }
      }
    }
  }

  .vux-x-switch {
    .fz(24) !important;
    .weui-switch:checked {
      border-color: #fe6246;
      background-color: #fe6246;
    }
  }

  .order-list {
    .rel;
    min-height: 200px;
    &.hasContent {
      height: 800px;
    }
    .order-tab {
      z-index: 10;
      .vux-tab-item {
        .rel;
        .vux-tab-item-badge {
          top: -20px;
          right: 0;
        }
      }
      .transi(.2s);
      &.fixed {
        width: 100%;
        .fix;
        top: 0;
      }
    }
    .inner-scroller {
      .borBox;
      padding: 0 0 50px;
      .v-items {
        .borBox;
        margin-bottom: 20/@rem;
        /*padding: 0 20/@rem 20/@rem;*/
        .bf;
        .bsd(0, 2px, 10px, 0, #ccc);
        .item-top {
          padding: 14/@rem 20/@rem;
          .txt-normal;
          .c3;
          .fz(24);
          .bor-b;
          .ico-store {
            .fl;
            display: inline-block;
            margin-top: 2/@rem;
            font-size: inherit;
            .size(30, 30);
            background: url(../../static/img/ico_store.png);
            .ele-base;
          }
          span {
            .fr;
            .fz(22);
            .cdiy(@c2);
          }
        }
        .item-middle {
          padding: 14/@rem 20/@rem;
          .flex;
          .bf8;
          .img-con {
            .rel;
            .size(130, 130);
            img {
              width: 100%;
              .abs-center-vh;
            }
          }
          .info-con {
            .flex-r(2);
            padding: 0 14/@rem;
            h3 {
              padding-bottom: 10/@rem;
              .txt-normal;
              .c3;
              .fz(26);
              .ellipsis-clamp-2;
            }
            .middle {
              .c9;
              .fz(22);
              .ellipsis-clamp-2;
              .unit-price {
                padding-right: 40/@rem;
                .c3;
                .fz(24);
              }
            }
            label {
              .fz(22);
              .progress {
                span {
                  padding-right: 20/@rem;
                }
              }
            }
          }
          .price-con {
            .flex-r(1);
            .right;
            .price {
              padding-bottom: 10/@rem;
              .c3;
              .fz(24);
            }
            .buy-count {
              .c9;
              .fz(22);
            }
          }
        }
        .item-bottom {
          .extra-info {
            margin-top: 2px;
            padding: 10/@rem 20/@rem;
            .bf8;
            p {
              .fz(22);
              .c3;
              span {
                .fr;
              }
              &:not(:last-child) {
                padding-bottom: 10/@rem;
              }
            }
          }
          .total-price {
            padding: 10/@rem 20/@rem;
            .right;
            .c3;
            .fz(22);
            .bor;
            span {
              .fz(30);
            }
          }
          .btns {
            padding: 20/@rem 20/@rem;
            overflow: hidden;
            a {
              .fr;
              padding: 4px 40/@rem;
              margin-left: 20/@rem;
              .cf;
              .fz(22);
              .borR(50px);
              &.btn-cancel, &.btn-del {
                .c6;
                .bor(1px, solid, #ccc);
              }
              &.btn-push, &.btn-appraise, &.btn-pay {
                .cdiy(@c2);
                .bor(1px, solid, @c2);
              }
            }
          }
        }
        &.grey {
          .c9!important;
        }
      }
    }
  }

</style>
