<template>
  <div class="tickets-con" v-cloak>
    <tab class="tickets-tab" bar-active-color="#f34c18">
      <!--<tab-item :selected="!params.saleStatus?true:false" @on-item-click="filterStatus"><i class="fa fa-th-large"></i>&nbsp;全部
      </tab-item>
      <tab-item :selected="params.saleStatus===1?true:false" @on-item-click="filterStatus(1)"><i
        class="fa fa-podcast"></i>&nbsp;出售
      </tab-item>
      <tab-item :selected="params.saleStatus===2?true:false" @on-item-click="filterStatus(2)"><i class="fa fa-plug"></i>&nbsp;停售
      </tab-item>-->
      <tab-item :selected="!params.saleStatus?true:false" @on-item-click="filterStatus">全部
      </tab-item>
      <tab-item :selected="params.saleStatus===1?true:false" @on-item-click="filterStatus(1)">出售
      </tab-item>
      <tab-item :selected="params.saleStatus===2?true:false" @on-item-click="filterStatus(2)">停售
      </tab-item>
      <tab-item :selected="isSale===true?true:false" @on-item-click="filterStatus('sale')">已售出
      </tab-item>
    </tab>
    <div class="tickets-list">
      <scroller class="inner-scroller" ref="ticketScroller" height="100%" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText="没有更多数据"
                snapping>
        <!-- content goes here -->
        <section class="v-items" v-for="(item, index) in goods" :data-id="item.id">
          <!--<h4 class="item-top"><i class="ico-store"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i
            class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>-->
          <div v-if="!isSale">
            <section class="item-middle">
              <div class="img-con" :style="item.imgurl?('background-image:url('+item.imgurl+')'):''"></div>
              <div class="info-con">
                <h3>{{item.name}}<span class="validDay">{{item.validDay?'有效期：' + item.validDay + '天' : '永久'}}</span></h3>
                <section class="middle">
                  <span class="unit-price">售价：￥{{item.price | toFixed}}元</span>
                  <span class="order-info">已售：{{item.saleCount}}件</span>
                </section>
                <label v-if="item.waterNote"><i class="fa fa-tag"></i>&nbsp;{{item.waterNote}}</label>
              </div>
            </section>
            <section class="item-bottom">
              <!--<div class="extra-info">-->
              <!--<p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span></p>-->
              <!--</div>-->
              <!--<div class="total-price">共{{item.buyCount}}件商品&nbsp;合计：<span>￥{{item.total}}</span>.00（含上楼费）</div>-->
              <div class="btns">
                <a class="btn btn-del" @click="editTicket(item)">编辑</a>
                <a class="btn btn-del" @click="setState(item.id,2)" v-if="item.saleStatus===1">下架</a>
                <a class="btn btn-del" @click="setState(item.id,1)" v-else>上架</a>
                <a class="btn btn-del" @click="delTicket(item.id)">删除</a>
              </div>
            </section>
          </div>
          <div v-else>
            <section class="item-middle">
              <div class="img-con" :style="item.ticketImage?('background-image:url('+item.ticketImage+')'):''"></div>
              <div class="info-con">
                <h3>{{item.ticketName}}<span class="validDay">{{item.validDay?'有效期：' + item.validDay + '天' : '永久'}}</span></h3>
                <section class="middle">
                  <span class="unit-price">售价：￥{{item.totalAmount | toFixed}}元</span>
                  <span class="price">已兑换：<i>{{item.exchangeWaterNum}}</i></span>
                  <span class="price">未兑换：<i>{{item.totalWaterNum - item.exchangeWaterNum}}</i></span>
                </section>
                <!--<label v-if="item.waterNote"><i class="fa fa-tag"></i>&nbsp;{{item.waterNote}}</label>-->
                <p class="payTime">{{item.payTime}}</p>
              </div>
            </section>
          </div>

        </section>
      </scroller>
    </div>
    <div class="add-goods" v-if="!isSale" v-jump="['edit_ticket',null,3]"><i class="fa fa-plus"></i>&nbsp添加水票</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Tab, TabItem} from 'vux'
  import {ticketApi} from '../../../service/main.js'

  export default {
    name: 'tickets',
    data() {
      return {
        isSale: false,
        curApi: ticketApi.list,
        goods: [],
        params: {
          pageSize: 10,
          pageNo: 1,
        },
        noMore: false,
        isPosting: false
      }
    },
    components: {Tab, TabItem},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getTickets()
      vm.$nextTick(function () {
        vm.$refs.ticketScroller.finishInfinite(true)
        vm.$refs.ticketScroller.resize()
      })
    },
    /* computed: {
     'params.type' () {
     return this.$route.params.type
     }
     }, */
    watch: {
      '$route'(to, from) {
        if (to.name === 'tickets') {
          vm.getTickets()
        }
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      toDetail(id) {
        vm.$router.push({path: '/detail/' + id})
      },
      getTickets(isLoadMore, status) {
        vm.params.type = this.$route.params.type || 0
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.isPosting = true
        vm.processing()
        vm.loadData(vm.curApi, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.pager
          if (!isLoadMore) {
            vm.goods = res.data.itemList
            if (resD.totalCount < vm.params.pageSize) {
              vm.noMore = true
            } else {
              vm.noMore = false
            }
            vm.goods = resD.itemList
          } else {
            if (resD.itemList.length) {
              for (var i = 0; i < resD.itemList.length; i++) {
                var cur = resD.itemList[i];
                vm.goods.push(cur)
              }
            } else {
              vm.noMore = true
            }
          }
          console.log(vm.goods, '商品数据')
        }, function () {
          vm.isPosting = false
        })
      },
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getTickets()
          vm.$refs.ticketScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getTickets(true)
          vm.$refs.ticketScroller.finishInfinite(true)
        }, 1000)
      },
      filterStatus(status) {
        vm.curApi = ticketApi.list
        vm.isSale = false
        if (status) {
          if (status === 'sale') {
            vm.isSale = true
            vm.curApi = ticketApi.saleList
          } else {
            vm.params.saleStatus = status
          }
        } else {
          delete vm.params.saleStatus
        }
        vm.getTickets()
      },
      delTicket(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '水票删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(ticketApi.delTicket, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      setState(id, status) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(ticketApi.update, {id: id, saleStatus: status}, 'POST', function (res) {
          vm.isPosting = false
          vm.toast(status === 1 ? '上架成功' : '已下架')
          vm.getTickets()
        }, function () {
          vm.isPosting = false
        })
      }, function () {
      },
      editTicket(data) {
        vm.$router.push({name: 'edit_ticket', query: {linedata: encodeURIComponent(JSON.stringify(data))}})
      },
      pushOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认催单？', '请不要频繁催单！', function () {
          vm.isPosting = true
          vm.loadData(ticketApi.cancelOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../../static/css/tools.less';
  /*.tickets-con{}*/

  .tickets-tab {
    z-index: 10;
    .vux-tab-item {
      &.vux-tab-selected {
        .cdiy(#f34c18) !important;
        /*   .cf!important;
           background: #f34c18 !important;*/
      }
    }
  }

  .tickets-list {
    .inner-scroller {
      .borBox;
      padding: 44px 0 50px;
      .v-items {
        .borBox;
        margin-bottom: 10/@rem;
        .bf;
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
            background: url(../../../../static/img/ico_store.png);
            .ele-base;
          }
          span {
            .fr;
            .fz(22);
            .cdiy(@c2);
          }
        }
        .item-middle {
          .rel;
          padding: 14/@rem 20/@rem 14/@rem 14/@rem;
          min-height: 140/@rem;
          .bf;
          .img-con {
            .abs;
            top: 14/@rem;
            .size(140, 140);
            overflow: hidden;
            background: #f5f5f5 url(../../../../static/img/bg_nopic.jpg) no-repeat center;
            -webkit-background-size: cover;
            background-size: cover;
          }
          .info-con {
            .rel;
            .borBox;
            width: 100%;
            padding: 0 0 0 160/@rem;
            h3 {
              padding-bottom: 10/@rem;
              .txt-normal;
              .c3;
              .fz(26);
              .ellipsis-clamp-2;
              .validDay {
                .fr;
                .c9;
                .fz(24);
              }
            }
            .middle {
              .c9;
              .fz(24);
              .ellipsis-clamp-2;
              .unit-price {
                padding-right: 40/@rem;
                .cdiy(@c2);
              }
              .price {
                .fr;
                padding-left: 16/@rem;
                i {
                  font-style: normal;
                  .cdiy(@c2);
                }
              }
            }
            label {
              .borBox;
              .block;
              padding-top: 10/@rem;
              .fz(20);
              i {
                .cdiy(#FFC107);
              }
            }
            .payTime {
              padding-top: 16/@rem;
              .fr;
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
            .bor-t;
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

  .add-goods {
    .fix;
    bottom: 0;
    width: 100%;
    .ma-w(640);
    .borBox;
    letter-spacing: 2px;
    padding: 24/@rem;
    .center;
    .cf;
    .fz(28);
    .bdiy(@c2);
  }
</style>
