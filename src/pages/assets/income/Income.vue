<template>
  <div class="income-con" v-cloak>
    <div class="top-con">
      <search
        @result-click="resultClick"
        @on-change="getResult"
        v-model="value"
        placeholder="输入买家名、商家名搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        ref="search"></search>
      <tab class="income-tab" bar-active-color="#f34c18">
        <tab-item :selected="type===1?true:false" @on-item-click="filterType(1)">订单
        </tab-item>
        <tab-item :selected="type===2?true:false" @on-item-click="filterType(2)">水票
        </tab-item>
      </tab>
    </div>
    <div class="income-list">
      <scroller class="inner-scroller" ref="incomeScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <swipeout>
          <swipeout-item disabled @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in results"
                         :data-id="item.id" key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('delete',item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <section class="v-items">
                <section class="wrap">
                  <img :src="item.userImage">
                  <div class="info-con">
                    <h3>买家：{{item.userName}}<span>{{item.createTime}}</span></h3>
                    <div class="nums"><span>商家：{{item.sellerName}}</span><span
                      class="income">收入：+{{((item.totalAmount || item.payAmount) || 0) | toFixed}}元</span>
                    </div>
                    <!--<div class="progress">
                      <div style='width:150px;height:150px;'>
                        <x-progress :percent="35" :showCancel="false"></x-progress>
                      </div>
                    </div>-->
                  </div>
                </section>
              </section>
            </div>
          </swipeout-item>
        </swipeout>
      </scroller>
    </div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem, Search, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {assetsApi} from '../../../service/main.js'

  export default {
    name: 'income-con',
    data() {
      return {
        type: 1,
        curApi: assetsApi.ordersList,
        value: '',
        results: [],
        list: [],
        isPosting: false,
        onFetching: false,
        noMore: false,
        params: {
          userType: 2,
          pageSize: 10,
          pageNo: 1
        },
      }
    },
    components: {Tab, TabItem, Search, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getIncome()
      vm.$nextTick(function () {
        vm.$refs.incomeScroller.finishInfinite(true)
        vm.$refs.incomeScroller.resize()
      })
    },
    /*computed: {},*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'income_list') {
          vm.getIncome()
        }
      }
    },
    methods: {
      onButtonClick(type, id) {
        if (type === 'delete') {
          vm.del(id)
        }
      },
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getIncome()
          vm.$refs.incomeScroller.finishPullToRefresh()
        }, 1000)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getIncome(true)
          vm.$refs.incomeScroller.finishInfinite(true)
        }, 1000)
      },
      filterType(type) {
        vm.type = type || 1
        if (type === 1) {
          vm.curApi = assetsApi.ordersList
        } else {
          vm.curApi = assetsApi.ticketsList
        }
        vm.getIncome()
      },
      getIncome(isLoadMore) {
        if (vm.onFecthing) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.onFecthing = true
        vm.loadData(vm.curApi, vm.params, 'POST', function (res) {
            vm.onFecthing = false
            vm.processing(0, 1)
            var resD = res.data.pager
            if (!isLoadMore) {
              if (resD.totalCount < vm.params.pageSize) {
                vm.noMore = true
              } else {
                vm.noMore = false
              }
              vm.list = resD.itemList
            } else {
              if (resD.itemList.length) {
                for (var j = 0; j < resD.itemList.length; j++) {
                  var cur = resD.itemList[j];
                  vm.list.push(cur)
                }
              } else {
                vm.noMore = true
              }
            }
            vm.results = vm.list.slice(0)
            // console.log(vm.list, '收支数据')
          }, function () {
            vm.onFecthing = false
            vm.processing(0, 1)
          }
        )
      },
      del(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', null, function () {
          vm.isPosting = true
          vm.loadData(assetsApi.del, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      resultClick(item) {
      },
      getResult(val) {
        if (val) {
          vm.results = []
          // vm.getIncome()
          for (let i = 0; i < vm.list.length; i++) {
            if (vm.list[i].userName.indexOf(val) > -1 || vm.list[i].sellerName.indexOf(val) > -1) {
              vm.results.push(vm.list[i])
            }
          }
        } else {
          vm.results = vm.list
        }
      },
      onSubmit() {
        this.$refs.search.setBlur()
        /*this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })*/
        vm.getIncome()
      },
      onFocus() {
        // console.log('on focus')
      },
      onCancel() {
        // console.log('on cancel')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .income-con {
    .rel;
    height: 100%;
    .top-con {
      .ma-w(640);
      width: 100%;
      position: fixed;
      z-index: 20;
      .vux-search-box {
        .ma-w(640);
        top: 0 !important;
        position: fixed !important;
        z-index: 10;
      }
      .income-tab {
        top: 44px !important;
        z-index: 10;
        .vux-tab-item {
          &.vux-tab-selected {
            .cdiy(#f34c18) !important;
          }
        }
      }
    }
    .income-list {
      .vux-swipeout-button-primary {
        background: #5d5454;
      }
      .vux-1px-t:before {
        .none;
      }
      .inner-scroller {
        .borBox;
        padding: 88px 0 50px;
        .v-items {
          .borBox;
          /*height: 150/@rem;*/
          margin-bottom: 10/@rem;
          .bf;
          .wrap {
            padding: 14/@rem 20/@rem;
            img {
              .size(80, 80);
              .abs-center-vertical;
              left: 20/@rem;
              .borR(50%);
            }
            .info-con {
              .borBox;
              padding-left: 100/@rem;
              h3 {
                padding-bottom: 10/@rem;
                .txt-normal;
                .c3;
                .fz(26);
                .ellipsis-clamp-2;
                span {
                  .fr;
                  .c9;
                  .fz(22);
                }
              }
              .nums {
                .fz(26);
                span {
                  padding-right: 20/@rem;
                  &.income {
                    .fr;
                    .cdiy(#fd271a);
                  }
                }
              }
              .progress {
                padding: 20/@rem 0;
                > div {
                  height: auto;
                }
              }
            }
          }
        }
      }
    }
  }

</style>
