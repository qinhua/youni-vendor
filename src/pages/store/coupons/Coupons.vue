<template>
  <div class="my-coupons" v-cloak>
    <!--<tab class="order-tab" active-color="#f34c18">
      <tab-item :selected="!params.type?true:false" @on-item-click="onItemClick">全部</tab-item>
      <tab-item :selected="params.type==1?true:false" @on-item-click="onItemClick(1)">优惠券</tab-item>
      <tab-item :selected="params.type==1?true:false" @on-item-click="onItemClick(2)">满减</tab-item>
    </tab>-->
    <div class="coupon-list" v-if="coupons.id" v-cloak>
      <!--<scroller class="inner-scroller" ref="couponScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>-->
      <!-- content goes here -->
      <swipeout>
        <swipeout-item disabled @on-close="" @on-open="" transition-mode="follow" :data-id="coupons.id" key="index">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('edit',coupons.id)" background-color="orange">编辑
            </swipeout-button>
            <swipeout-button @click.native="onButtonClick('delete',coupons.id)" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" class="demo-content vux-1px-t">
            <section class="v-items">
              <!--<div :class="('stamp type0'+coupons.type) + (!coupons.status?' expired':'')">-->
              <div class="stamp type01">
                <div class="wrap">
                  <div class="par">
                    <!--<p>{{coupons.sellerName}}</p>-->
                    <div class="content">
                      <h3 class="value">￥{{coupons.discountAmount | toFixed}}元</h3>
                      <sub class="type">满减</sub>
                      <sub class="sign">（最多抵扣）￥{{coupons.maxDiscountAmount | toFixed}}</sub>
                      <!--<sub class="type">{{coupons.goodsType | couponType(coupons.goodsType)}}</sub>-->
                    </div>
                    <p class="info">满{{coupons.upAmount}}减{{coupons.discountAmount}}</p>
                  </div>
                  <div class="copy" v-if="!coupons.expired">{{coupons.label}}<p>
                    {{coupons.createTime ? (coupons.createTime.split(' ')[0] + '~') : ''}}{{coupons.createTime ? (coupons.expireTime.split(' ')[0]) : ''}}
                  </p>
                  </div>
                  <div class="copy" v-else><span class="exp">已过期</span></div>
                </div>
                <i></i>
              </div>
            </section>
          </div>
        </swipeout-item>
      </swipeout>
      <!--</scroller>-->
    </div>
    <div class="btn-bottom" v-jump="['edit_coupon',null,3]" v-if="!coupons.discountAmount"><i class="fa fa-plus"></i>&nbsp添加优惠
    </div>
    <div class="btn-bottom edit" @click="edit" v-else><i
      class="fa fa-pencil"></i>&nbsp编辑当前优惠
    </div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem, Search, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {couponApi} from '../../../service/main.js'

  export default {
    name: 'my-coupons',
    data() {
      return {
        coupons: {},
        params: {
          type: 0,
          pageSize: 10,
          pageNo: 1
        },
        noMore: false,
        isPosting: false
      }
    },
    components: {Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getCoupons()
    },
//    computed: {},
    watch: {
      '$route'(to, from) {
        if (to.name === 'coupons') {
          vm.getCoupons()
        }
      }
    },
    methods: {
      getCoupons(isLoadMore) {
        if (vm.isPosting) return false
        vm.processing()
        vm.isPosting = true
        vm.loadData(couponApi.get, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data
          if (res.data) {
            resD.expired = me.compareCurrentDate(resD.expireTime)
          }
          vm.coupons = resD
          console.log(vm.coupons, '优惠券数据')
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      del(id) {
        vm.confirm('确认删除？', '删除后不可恢复！', function () {
          vm.loadData(couponApi.delCoupon, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      edit() {
        this.$router.push({
          name: 'edit_coupon',
          query: {linedata: window.encodeURIComponent(JSON.stringify(vm.coupons))}
        })
      },
      onButtonClick(type, id) {
        if (type === 'edit') {
          this.$router.push({name: 'edit_coupon', query: {id: id}})
        } else {
          vm.del(id)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .my-coupons {
    height: 100%;
    .bf5;
    overflow-y: auto;
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
  }

  .coupon-list {
    .borBox;
    padding: 20px 0 20px 0;
    .bf;
    .v-items {
      .borBox;
      width: 100%;
      margin-bottom: 20/@rem;
      .stamp {
        .rel;
        .borBox;
        width: 94%;
        min-height: 200/@rem;
        padding: 0 30/@rem;
        margin: 0 auto 16/@rem;
        overflow: hidden;
        &:before {
          .abs;
          .block;
          top: 0;
          left: 0;
          width: 20px;
          height: 100%;
          content: '';
        }
        &:after {
          .abs;
          .block;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          content: '';
        }
        .wrap {
          .flex;
          .borBox;
          .abs;
          padding: 20/@rem 0 20/@rem 20/@rem;
          content: '';
          top: 0;
          bottom: 0;
          left: 10px;
          right: 10px;
          z-index: -1;
          background-color: #e0552e;
        }
        i {
          position: absolute;
          right: -20%;
          top: 120/@rem;
          height: 300/@rem;
          width: 320px;
          z-index: 5;
          .fz(24);
          background-color: rgba(255, 255, 255, .15);
          transform: rotate(-30deg);
        }
        .par {
          .rel;
          .flex-r(3);
          z-index: 5;
          .left;
          border-right: 2px dashed rgba(255, 255, 255, .3);
          p {
            padding-top: 5/@rem;
            color: #fff;
            .fz(24);
          }
          .content {
            .rel;
            padding: 10/@rem 0;
            .value {
              .fz(48);
              color: #fff;
              font-weight: normal;
              margin-right: 14/@rem;
              line-height: 60/@rem;
            }
            .type {
              .abs;
              top: 20/@rem;
              right: 20/@rem;
              padding: 0 2px;
              .bor(1px, solid, #fff);
              .fz(24);
              color: rgba(255, 255, 255, .8);
            }
            .sign {
              .block;
              .fz(24);
              color: rgba(255, 255, 255, .8);
            }
            .info {
              .cdiy(#ffe041);
            }
          }
        }
        .copy {
          .rel;
          .flex-r(1);
          .rel;
          z-index: 5;
          padding: 30/@rem;
          .fz(26);
          .center;
          color: rgb(255, 255, 255);
          .exp {
            .abs-center-vh;
          }
          p {
            .fz(18);
            margin-top: 10/@rem;
          }
        }
        /*&.type-coupon {*/
        &.type01 {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #f1a83f;
          }
        }
        /*&.type-ticket {*/
        &.type02 {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #3fa1f1;
          }
        }
        /*&.type-redpacket {*/
        &.type03 {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #e0552e;
          }
        }
        &.type04 {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #e0552e;
          }
        }
        /*&.type-expired {*/
        &.expired {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #bbb;
          }
        }
      }
    }
  }

  .btn-bottom {
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
    &.edit {
      background: #f1a83f;
    }
  }
</style>
