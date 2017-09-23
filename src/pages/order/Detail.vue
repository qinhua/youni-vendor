<template>
  <div class="order-detail">
    订单详情
  </div>
</template>

<script>
  /* eslint-disable */
  let me
  let vm
  import Swiper from 'swiper'
  import {Tab, TabItem, XNumber, Group, Cell, TransferDom, Popup, XButton} from 'vux'
  import {homeApi, nearbyApi, goodsApi} from '../../service/main.js'

  export default {
    name: 'order-detail',
    data() {
      return {
        id: null,
        addText: '添加购物车',
        showPop: false,
        details: {},
        tablist: ['商品详情', '规格', '评论'],
        isPosting: false,
        cartData: null,
        curCount: 0,
        curBuyNum: 1,
        total: 0,
        detailSwiper: null,
        curIndex: 0,
        appIdx: 0,
        appraiseData: null,
        appraise: [],
        balls: [ //小球 设为3个
          {
            show: false
          }, {
            show: false
          }, {
            show: false
          },
        ],
        dropBalls: [],
      }
    },
    directives: {
      TransferDom
    },
    components: {Tab, TabItem, XNumber, Group, Cell, Popup, XButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getDetail(function () {
        vm.viewCart()
      })
//      vm.$nextTick(function() {
//        vm.$refs.orderScroller.finishInfinite(true)
//        vm.$refs.orderScroller.resize()
//      })
    },
    /*computed: {
     total() {
     return vm.details.number ? vm.details.number * vm.details.price : 0
     }
     },*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'goods_detail') {
          vm.getDetail(function () {
            vm.viewCart()
            vm.mySwiper()
            vm.total = vm.details.number * vm.details.price
            // vm.swiperDetail()
            // vm.getAppraise()
          })
        }
      },
      'details.number'() {
        vm.total = vm.details.number * vm.details.price
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
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
      getDetail(cb) {
        vm.id = vm.$route.query.id
        if (vm.isPosting) return false
        vm.processing()
        vm.isPosting = true
        vm.loadData(goodsApi.view, {id: vm.id}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {
            var resD = res.data
            resD.categoryName = (resD.type === 'goods_type.1') ? '水' : '奶'
            vm.details = resD
            vm.getSeller(res.data.sellerId)
            console.log(vm.details, '商品详情')
          }
          cb ? cb() : null
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      getSeller(id) {
        vm.loadData(nearbyApi.sellerDetail, {id: id}, 'POST', function (res) {
          if (res.data) {
            vm.details.sellerName = res.data.name
          }
        })
      },
      chooseCol(index) {
        vm.detailSwiper.slideTo(index)
      },
      getAppraise(index) {
        vm.loadData(orderApi.appraise, {type: index || 0}, 'POST', function (res) {
          vm.appraiseData = vm.appraise = res.data.itemList
          console.log(vm.appraiseData, '用户评价数据')
          cb ? cb() : null
        }, function () {
        })
      },
      filterAppraise(index) {
        vm.appIdx = index
        vm.appraise = []
        if (vm.appraiseData) {
          if (index === 0) {
            vm.appraise = vm.appraiseData
            return;
          }
          for (let i = 0; i < vm.appraiseData.length; i++) {
            if (vm.appraiseData[i].type === index) {
              vm.appraise.push(vm.appraiseData[i])
            }
          }
        } else {
          vm.getAppraise()
        }
      },
      swDialog(type) {
        vm.showPop = true
        if (type === 1) {
          vm.addText = '加入购物车'
        } else {
          vm.addText = '立即购买'
        }
      },
      viewCart(cb) {
        vm.loadData(cartApi.view, null, 'POST', function (res) {
          var resD = res.data
          // console.log(resD, '购物车数据')
          vm.cartData = resD
          vm.curCount = resD.totalNum
          vm.syncList()
          cb ? cb() : null
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      changeCount(obj) {
        if (vm.isPosting) return
        vm.isPosting = true
        if (obj.type === 'add') {
          if (vm.cartData.sellerId && vm.cartData.sellerId !== obj.sellerId) {
            //vm.toast('购物车中已有其他店铺商品，请先清空')
            vm.confirm('温馨提示', '当前购物车中已有其他店铺商品，请先清空！', function () {
              vm.isPosting = true
              vm.loadData(cartApi.clear, null, 'POST', function (res) {
                vm.viewCart()
                vm.isPosting = false
              }, function () {
                vm.isPosting = false
              })
            })
            return
          }
          vm.loadData(cartApi.add, {goodsId: obj.id}, 'POST', function (res) {
            if (res.success) {
              vm.viewCart()
              vm.additem(obj.event)
            } else {
              vm.toast(res.message || '购物车中已有其他店铺商品，请先清空')
            }
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        } else {
          vm.loadData(cartApi.minus, {goodsId: obj.id}, 'POST', function (res) {
            vm.viewCart()
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
          if (!obj.value) {
            vm.isPosting = false
            vm.details.number = 0
            return
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .order-detail {
    height: 100%;
    overflow: auto;
    .top {
      margin-bottom: 14/@rem;
      .banner-goods-detail {
        margin-bottom: 10/@rem;
        height: 440/@rem !important;
        overflow: hidden;

        .swiper-container {
          height: 440/@rem !important;
          .swiper-slide {
            height: 100%;
            background-position: top center;
            -webkit-background-size: cover;
            background-size: cover;
          }
          .swiper-pagination {
            bottom: 5px;
          }
          .swiper-pagination-bullet {
            background: rgba(255, 255, 255, .5);
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
            background: #fff !important;
          }
        }

      }
      .buy-con {
        padding: 20/@rem;
        .bf;
        .bor-t;
        .wrap {
          .rel;
        }
        .title {
          .fz(26);
          .c3;
          margin-bottom: 8/@rem;
          .ellipsis-clamp-2;
          span {
            margin-right: 4px;
            padding: 0 2px;
            font-weight: normal;
            .cf;
            .fz(22);
            background: #2acaad;
            .borR(2px);
            &.milk {
              background: #74c361;
            }
          }
        }
      }
      .txt-con {
        .borBox;
        padding-right: 200/@rem;
        .middle {
          padding: 10/@rem 0;
          .fz(24);
          .c9;
          .price {
            .fz(30);
            .cdiy(@c2);
          }
          .stock {
            padding-right: 10/@rem;
            .fr;
          }
          sub {
            .fz(24);
            padding-left: 20/@rem;
          }
        }
        .tags {
          .cdiy(#f34c18);
          overflow: hidden;
          li {
            .fl;
            margin: 0 10/@rem 5/@rem 0;
            padding: 1px 8px;
            line-height: 1.8;
            .cf;
            .fz(18);
            .borR(2px);
            background: orange;
          }
        }
      }
      .right-con {
        .abs;
        top: 0;
        right: 0;
        width: 200/@rem;
        height: 100%;
        .inner {
          .rel;
          width: 100%;
          height: 100%;
          button {
            .abs-center-vh;
            padding: 18/@rem 14/@rem 18/@rem 50/@rem;
            line-height: 1;
            .fz(22);
            .cf;
            .borR(4px);
            .bdiy(@c3);
            &:before {
              position: absolute;
              margin-left: -30/@rem;
              content: '';
              display: block;
              font-size: inherit;
              .size(24, 24);
              background: url(../../../static/img/ico_cart.png) no-repeat center;
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .bottom {
      .title {
        .borBox;
        padding: 10/@rem 20/@rem;
        .fz(24);
        background: #fff;
        .bor-l(3px, solid, red);
        .bor-b;
      }
      .swiper-goods-detail {
        width: 100%;
        padding-bottom: 120/@rem;
        .bf;
        .swiper-slide {
          padding-bottom: 20px;
          .bf;
        }
        .detail-con {
          .borBox;
          padding: 20/@rem;
          ul, ol {
            list-style: decimal;
            list-style-position: inside;
          }
        }
        .goods-param {
          .borBox;
          padding: 20/@rem;
          overflow: hidden;
          li {
            .fl;
            padding: 4px 0;
            .fz(22);
          }
        }
        .appraise {
          .borBox;
          padding: 20/@rem 0;
          .appraise-nav {
            .borBox;
            width: 96%;
            .ma;
            overflow: hidden;
            padding: 20/@rem 0;
            .bor-b;
            > li {
              margin-right: 6px;
              padding: 4px 8px;
              line-height: 1;
              opacity: .5;
              .fl;
              .rfz(13);
              .cf;
              .bdiy(#ddd);
              .transi(.2s);
              &[selected='selected'] {
                padding: 4px 10px;
                opacity: 1;
                .cf;
                .bdiy(@c2);
              }
              &.good {
                .bdiy(@c2);
              }
              &.middle {
                .bdiy(orange);
              }
              &.bad {
                .bdiy(#999);
              }
            }
          }
          .appraise-content {
            width: 100%;
            .bf5;
            li {
              margin-top: 10/@rem;
              padding: 16/@rem;
              .bf;
            }
            .wrap {
              .rel;
            }
            .buyer {
              .abs;
              top: 0;
              left: 0;
              width: 120/@rem;
              .center;
              img {
                .block;
                .size(80, 80);
                .ma;
                .borR(50%);
              }
              span {
                padding: 5px 0;
                .rfz(12);
                .c6;
              }
            }
            .mtxt-con {
              .borBox;
              width: 100%;
              min-height: 130/@rem;
              padding-left: 140/@rem;
              .score-con {
                overflow: hidden;
                .cdiy(#f37f18);
                .u-stars {
                  .fl;
                  overflow: hidden;
                  li {
                    padding: 0;
                    margin-top: 0;
                    .fl;
                    .rfz(16);
                    .no-bor;
                  }
                }
                span {
                  .fl;
                  .rfz(14);
                  margin: 2px 0 0 10px;
                }
                &.grey {
                  .c9;
                }
              }
              p {
                clear: both;
                padding: 10/@rem 0;
                .fz(22);
                .c3;
              }
            }
            .time {
              .abs;
              top: 0;
              right: 0;
              .c9;
              .rfz(10);
            }

          }
        }
      }
    }
  }

</style>
