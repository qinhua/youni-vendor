<template>
  <div class="my-guarantee" v-cloak>
    <div class="gua-tab-con">
      <tab class="gua-tab" active-color="#FE6246">
        <!--<tab-item :selected="!params.status?true:false" @on-item-click="onItemClick">全部</tab-item>-->
        <tab-item :selected="params.status==1?true:false" @on-item-click="onItemClick(1)">正常</tab-item>
        <tab-item :selected="params.status==5?true:false" @on-item-click="onItemClick(5)">申请退款</tab-item>
        <tab-item :selected="params.status==2?true:false" @on-item-click="onItemClick(2)">退款中</tab-item>
        <tab-item :selected="params.status==3?true:false" @on-item-click="onItemClick(3)">已退款</tab-item>
        <tab-item :selected="params.status==4?true:false" @on-item-click="onItemClick(6)">已拒绝</tab-item>
      </tab>
    </div>
    <div class="fee-list" v-if="list.length" v-cloak>
      <scroller class="inner-scroller" ref="guaScroller" height="100%" :on-refresh="refresh"
                :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText="就这么多了"
                snapping>
        <!-- content goes here -->
        <section class="v-items" v-for="item in list" :data-id="item.id">
          <section class="wrap">
            <img :src="item.headimgurl">
            <div class="info-con">
              <h3>买家姓名：{{item.nickname}}<span :class="['tg',item.statusCls]">{{item.statusTxt}}</span></h3>
              <div class="bottom">
                <p>桶数：<i>{{item.bucketNum}}桶</i></p>
                <!--<p>单价：<i>￥{{item.totalAmount | toFixed}}元</i><span>总金额：<i>￥{{item.bucketAmount | toFixed}}元</i></span>-->
                <p>总金额：<i>￥{{item.totalAmount | toFixed}}元</i></p>
                <div class="btn-group" v-if="item.status===5">
                  <button type="button" class="btn pass" @click="pass(item.id)">同意退还
                  </button>
                  <button type="button" class="btn deny" @click="deny(item.id)">拒绝退还
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>
      </scroller>
    </div>
    <div class="iconNoData abs-center-vh" v-else><i></i>
      <p>暂无记录</p></div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Tab, TabItem} from 'vux'
  import {depositApi} from '../../service/main.js'

  export default {
    name: 'my-guarantee',
    data() {
      return {
        onFetching: false,
        noMore: false,
        isPosting: false,
        list: [],
        params: {
          status: 1,
          pageSize: 10,
          pageNo: 1
        }
      }
    },
    components: {Tab, TabItem},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getDeposits()
      vm.$nextTick(function () {
        vm.$refs.guaScroller.finishInfinite(true)
        vm.$refs.guaScroller.resize()
      })
    },
    computed: {},
    methods: {
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getDeposits()
          try {
            vm.$refs.guaScroller.finishPullToRefresh()
          } catch (e) {
            // console.log(e)
          }
        }, 1200)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getDeposits(true)
          try {
            vm.$refs.guaScroller.finishInfinite(true)
          } catch (e) {
            // console.log(e)
          }
        }, 1000)
      },
      getDeposits(isLoadMore) {
        if (vm.isPosting) return false
        // vm.processing()
        vm.isPosting = true
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.loadData(depositApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
          // vm.processing(0, 1)
          var resD = res.data.pager
          if (resD.itemList.length) {
            for (var i = 0; i < resD.itemList.length; i++) {
              var cur = resD.itemList[i];
              switch (cur.status) {
                case 1:
                  cur.statusTxt = '正常'
                  cur.statusCls = 'normal'
                  break
                case 2:
                  cur.statusTxt = '退款中'
                  cur.statusCls = 'during'
                  break
                case 3:
                  cur.statusTxt = '已退款'
                  cur.statusCls = 'normal'
                  break
                case 4:
                  cur.statusTxt = '退款失败'
                  cur.statusCls = 'fail'
                  break
                case 5:
                  cur.statusTxt = '退款申请中'
                  cur.statusCls = 'during'
                  break
                case 6:
                  cur.statusTxt = '已拒绝'
                  cur.statusCls = 'fail'
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
            vm.list = resD.itemList
          } else {
            if (resD.itemList.length) {
              for (var i = 0; i < resD.itemList.length; i++) {
                var cur = resD.itemList[i];
                vm.list.push(cur)
              }
            } else {
              vm.noMore = true
            }
            // resD.itemList.length ? vm.list.concat(resD.itemList) : vm.noMore = true
          }
          // console.log(vm.list, '保证金数据')
        }, function () {
          vm.isPosting = false
          // vm.processing(0, 1)
        })
      },
      onItemClick(status) {
        vm.list = []
        status ? vm.params.status = status : delete vm.params.status
        vm.getDeposits()
      },
      pass(id) {
        vm.confirm('确认退还押金？', '押金将原路退回买家账户', function () {
          vm.isPosting = true
          vm.loadData(depositApi.audit, {id: id, result: 'pass'}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('已退还')
              vm.getDeposits()
            } else {
              vm.toast(res.message || '操作失败', 'warn')
            }
          }, function () {
            vm.isPosting = false
          }, true)
        }, function () {
        })
      },
      deny(id) {
        vm.confirm('确认拒绝？', '买家将收不到退款', function () {
          vm.isPosting = true
          vm.loadData(depositApi.audit, {id: id, result: 'deny'}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('已拒绝')
              vm.getDeposits()
            } else {
              vm.toast(res.message || '操作失败', 'warn')
            }
          }, function () {
            vm.isPosting = false
          }, true)
        }, function () {
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';

  .my-guarantee {
    min-height: 100%;
    .bf5;
    h2 {
      padding: 14/@rem 20/@rem;
      .fz(24);
      .cdiy(#e46363);
      font-weight: normal;
      .bdiy(#fff1d1);
    }
    .inner-table {
      .bf;
      .bsd(0, 1px, 10px, 0, #eee);
      thead {
        background: #f5f5f5;
        th {
          font-weight: bold;
        }
      }
      tr {
        .fz(24);
        td {
          .name {
            padding: 1px;
            line-height: 1.5;
            max-width: 200/@rem;
            .ellipsis-clamp-2;
          }
        }
      }
      .btn {
        padding: 3px 14/@rem;
        .fz(22);
        .cf;
        background: @c2;
        .borR(3px);
        &.disabled {
          .bc;
        }
      }
    }
    .gua-tab-con {
      .fix;
      width: 100%;
      top: 0;
      z-index: 20;
      .gua-tab {
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
    }
    .fee-list {
      .vux-swipeout-item {
        &:not(:last-child) {
          .bor-b;
        }
      }
      .vux-swipeout-button {
        font-size: 14px;
      }
      .vux-swipeout-button-primary {
        background: #5d5454;
      }
      .vux-1px-t:before {
        .none;
      }
      .inner-scroller {
        padding: 44px 0 50px;
        .v-items {
          .borBox;
          .bf;
          .bor-t;
          .wrap {
            .rel;
            padding: 14/@rem 20/@rem;
            img {
              .size(80, 80);
              .abs-center-vertical;
              left: 20/@rem;
              .borR(50%);
            }
            .info-con {
              .rel;
              .borBox;
              padding-left: 100/@rem;
              h3 {
                .txt-normal;
                .c3;
                .fz(26);
                .ellipsis-clamp-2;
                span:first-of-type {
                  margin-left: 30/@rem;
                }
                .tg {
                  float: right;
                  padding: 0 2px;
                  font-weight: normal;
                  .c3;
                  .fz(16);
                  &.normal {
                    .cdiy(#66c745);
                    .bor(1px, solid, #66c745);
                  }
                  &.during {
                    .cdiy(#fbaf65);
                    .bor(1px, solid, #fbaf65);
                  }
                  &.fail {
                    .cdiy(#999);
                    .bor(1px, solid, #999);
                  }
                }
              }
              .bottom {
                .rel;
                padding-top: 10/@rem;
              }
              p {
                .fz(24);
                line-height: 1.8;
                .c7;
                span {
                  padding-left: 30/@rem;
                }
                i {
                  .cdiy(@c2);
                  font-style: normal;
                }
              }
              .btn-group {
                .abs;
                width: 140/@rem;
                right: 0;
                bottom: 0;
                button {
                  width: 100%;
                  .fl;
                  padding: 2px 0;
                  .fz(24);
                  .cf;
                  .bdiy(#fea146);
                  .borR(4px);
                  &:not(:last-child) {
                    margin-bottom: 12/@rem;
                  }
                  &.pass {
                    .bdiy(#66c745);
                  }
                  &.deny {
                    .bdiy(#f35858);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
