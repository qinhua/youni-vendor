<template>
  <div class="home-con" ref="home" v-cloak>
    <geo :visible="false" :cache="true" @on-geo-end="getMap"></geo>
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
        <p class="yesterday">昨日：{{1000|toFixed}}</p>
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
          <tab-item :selected="!params.status?true:false" @on-item-click="onItemClick">全部</tab-item>
          <tab-item :selected="params.status==1?true:false" @on-item-click="onItemClick(1)">待支付</tab-item>
          <tab-item :selected="params.status==2?true:false" @on-item-click="onItemClick(2)">待派送</tab-item>
          <tab-item :selected="params.status==3?true:false" @on-item-click="onItemClick(3)">派送中</tab-item>
          <tab-item :selected="params.status==4?true:false" @on-item-click="onItemClick(4)">已完成</tab-item>
        </tab>
        <tab class="order-tab" ref="orderTab" active-color="#FE6246" v-else>
          <tab-item :selected="!params.status?true:false" @on-item-click="onItemClick">全部</tab-item>
          <tab-item :selected="params.status==1?true:false" @on-item-click="onItemClick(1)">配送中</tab-item>
          <tab-item :selected="params.status==2?true:false" @on-item-click="onItemClick(2)">已暂停</tab-item>
          <tab-item :selected="params.status==4?true:false" @on-item-click="onItemClick(4)">已完成</tab-item>
        </tab>
      </sticky>
      <div :class="'order-list' + (orders.length?' hasContent':'')">
        <scroller class="inner-scroller" ref="orderScroller" :on-refresh="refresh" :on-infinite="infinite"
                  refreshText="下拉刷新" noDataText="没有更多数据" snapping v-if="!isMilk">
          <!-- content goes here -->
          <section class="v-items" v-for="(item, index) in orders" :data-id="item.id"
                   :data-orderNumber="item.appOrderNumber" :data-itemId="item.orderItemId">
            <!--<h4 class="item-top"><i class="ico-store"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i
              class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>-->
            <section class="item-middle">
              <div class="img-con">
                <img :src="item.goodsImage">
              </div>
              <div class="info-con">
                <h3>{{item.goodsName}}</h3>
                <section class="middle">
                  <span class="unit-price">￥{{item.goodsPrice}}</span>
                  <span class="order-info">{{item.info}}</span>
                </section>
                <label>{{item.label}}</label>
              </div>
              <div class="price-con">
                <p class="price">￥{{(item.goodsPrice * item.goodsAmount) | toFixed}}</p>
                <p class="buy-count">x{{item.goodsAmount}}</p>
              </div>
            </section>
            <section class="item-bottom">
              <!--<div class="extra-info">
                <p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span>
                </p>
              </div>-->
              <div class="total-price">
                共{{item.buyCount}}件商品&nbsp;合计：<span>￥{{(item.goodsPrice * item.goodsAmount) | toFixed}}</span>（含上楼费）
              </div>
              <div class="btns" v-if="item.status===-1">
                <a class="btn btn-del" @click="delOrder(item.orderId)">删除订单</a>
              </div>
              <!--<div class="btns" v-if="item.status===0">
                <a class="btn btn-pay" @click="payOrder(item.orderId)">支付</a>
                <a class="btn btn-cancel" @click="cancelOrder(item.orderId)">取消订单</a>
              </div>-->
              <div class="btns" v-if="item.status===1">
                <a class="btn btn-cancel" @click="pushPay(item.orderId)">提醒支付</a>
                <a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===2">
                <a class="btn btn-cancel" @click="dispatchOrder(item.orderId)">派送</a>
                <a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===4">
                <a class="btn btn-del" @click="delOrder(item.orderId)">删除订单</a>
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
                <img :src="item.goodsImage">
              </div>
              <div class="info-con">
                <h3>{{item.goodsName}}</h3>
                <section class="middle">
                  <span class="unit-price">￥{{item.unitPrice}}</span>
                  <span class="order-info">{{item.info}}</span>
                </section>
                <label class="progress"><span>已送：5次</span>&nbsp;&nbsp;<span>待送：13次</span></label>
              </div>
              <div class="price-con">
                <p class="price">￥{{(item.goodsPrice * item.goodsAmount) | toFixed}}</p>
                <p class="buy-count">x{{item.goodsAmount}}</p>
              </div>
            </section>
            <section class="item-bottom">
              <!--<div class="extra-info">
                <p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span>
                </p>
              </div>-->
              <div class="total-price">
                共{{item.goodsAmount}}件商品&nbsp;合计：<span>￥{{(item.goodsPrice * item.goodsAmount) | toFixed}}</span>（含上楼费）
              </div>
              <div class="btns" v-if="item.status===-1">
                <a class="btn btn-del" @click="delOrder(item.orderId)">删除订单</a>
              </div>
              <!--<div class="btns" v-if="item.status===0">
                <a class="btn btn-pay" @click="payOrder(item.orderId)">支付</a>
                <a class="btn btn-cancel" @click="cancelOrder(item.orderId)">取消订单</a>
              </div>-->
              <div class="btns" v-if="item.status===1">
                <a class="btn btn-cancel" @click="pushPay(item.orderId)">提醒支付</a>
                <a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===2">
                <a class="btn btn-cancel" @click="dispatchOrder(item.orderId)">派送</a>
                <a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===3">
                <a class="btn btn-cancel" @click="dispatchOrder(item.orderId)">恢复派送</a>
                <a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>
              </div>
              <div class="btns" v-if="item.status===4">
                <a class="btn btn-del" @click="delOrder(item.orderId)">删除订单</a>
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
        geo: null,
        isMilk: false,
        location: '',
        type: 0,
        orders: [],
        scrollTop: 0,
        isPosting: false,
        params: {
          userType: 2,
          goodsType: 'water',
          pagerSize: 10,
          pageNo: 1
        },
        noMore: false,
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
        }
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
      vm.getOrders()
      vm.$nextTick(function () {
        vm.$nextTick(function () {
          vm.$refs.orderScroller.finishInfinite(true)
          vm.$refs.orderScroller.resize()
        })
      })
    },
    computed: {},
    watch: {
      '$route'(to, from) {
        if(to.name==='home') {
          vm.getOrders()
        }
      },
      isMilk() {
        vm.params.goodsType = vm.isMilk ? 'milk' : 'water'
        vm.getOrders()
      }
    },
    methods: {
      // 全局定位
      getMap(data) {
        console.log(data, 'home geo info')
        this.geo = data
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
      /* 页面数据 */
      changeType() {
        // vm.getOrders()
      },
      /* 上下拉刷新 */
      onPullDown() {
        if (vm.isPosting) return false
        // this.isPosting = true
        setTimeout(function () {
          vm.getGoods()
          vm.$nextTick(function () {
            vm.$refs.myScroll.reset({top: 0})
            vm.$refs.myScroll.donePullup()
            vm.$refs.myScroll.donePulldown()
          })
        }, 1500)
      },
      onPullUp() {
        if (vm.isPosting) {
          // do nothing
          return false
        } else {
          /* if(vm.$refs.myScroll.top<500){
           return
           } */
          // vm.isPosting = true
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
      getOrders(isLoadMore) {
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.isPosting = true
        vm.loadData(orderApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.pager
          if (resD.itemList.length) {
            for (var i = 0; i < resD.itemList.length; i++) {
              var cur = resD.itemList[i]
              switch (cur.status) {
                case -1:
                  cur.statusName = '已取消'
                  break
                case 1:
                  cur.statusName = '待支付'
                  break
                case 2:
                  cur.statusName = '待派送'
                  break
                case 3:
                  cur.statusName = '派送中'
                  break
                /*case 3:
                  cur.statusName = '待评价'
                  break*/
                case 4:
                  cur.statusName = '已完成'
                  break
              }
            }
          }
          if (!isLoadMore) {
            if (resD.totalCount < vm.params.pageSize) {
              vm.noMore = true
            } else {
              vm.noMore = false
            }
            vm.orders = resD.itemList
          } else {
            resD.itemList.length ? vm.orders.concat(resD.itemList) : vm.noMore = true
          }
          console.log(vm.orders, '订单数据')
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      delOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.del, {id: id}, 'POST', function (res) {
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
          vm.loadData(orderApi.cancel, {id: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('已取消')
          }, function () {
            vm.toast('取消失败')
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      pushPay(id) {
        if (vm.isPosting) return false
          vm.isPosting = true
          vm.loadData(orderApi.push, {id: id}, 'POST', function (res) {
            vm.toast('提醒成功')
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
      },
      dispatchOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认派送？', '', function () {
          vm.isPosting = true
          vm.loadData(orderApi.push, {id: id}, 'POST', function (res) {
            vm.toast('已确认')
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        })
      },
      onItemClick(status) {
        status ? vm.params.status = status : delete vm.params.status
        vm.getOrders()
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
    .orders-list-con {
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
          /*.bsd(0, 2px, 10px, 0, #ccc);*/
          .bor-t(1px,solid,#ddd);
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
              overflow: hidden;
              img {
                .abs-center-vh;
                width: 100%;
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
  }



</style>
