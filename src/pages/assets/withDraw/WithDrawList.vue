<template>
  <div class="draw-list-con" v-cloak>
    <div class="search-con">
      <search
        @result-click="resultClick"
        @on-change="getResult"
        v-model="value"
        placeholder="输入时间搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        ref="search"></search>
    </div>
    <div class="draw-list">
      <scroller class="inner-scroller" ref="drawScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <swipeout>
          <swipeout-item disabled @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in results"
                         :data-id="item.id" key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('delete',item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <section class="v-items" :data-id="item.sellerId">
                <section class="wrap">
                  <img :src="item.sellerImage">
                  <div class="info-con">
                    <h3>商家：{{item.sellerName}}</h3>
                    <div class="nums"><span>金额：<i>￥{{item.takeAmount | toFixed}}元</i></span><span
                      class="withdraw">{{item.takeDate}}</span></div>
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
  import {Search, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {assetsApi} from '../../../service/main.js'

  export default {
    name: 'draw-list-con',
    data() {
      return {
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
    components: {Search, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getDraw()
      vm.$nextTick(function () {
        vm.$refs.drawScroller.finishInfinite(true)
        vm.$refs.drawScroller.resize()
      })
    },
    /*computed: {},*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'with_draw_list') {
          vm.getDraw()
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
          vm.getDraw()
          vm.$refs.drawScroller.finishPullToRefresh()
        }, 1000)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getDraw(true)
          vm.$refs.drawScroller.finishInfinite(true)
        }, 1000)
      },
      getDraw(isLoadMore) {
        if (vm.onFecthing) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.onFecthing = true
        vm.loadData(assetsApi.withDrawList, vm.params, 'POST', function (res) {
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
              resD.itemList.length ? vm.list.concat(resD.itemList) : vm.noMore = true
            }
            vm.results = vm.list.slice(0)
            // console.log(vm.list, '提现数据')
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
          vm.loadData(clientApi.del, {id: id}, 'POST', function (res) {
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
          // vm.getDraw()
          for (let i = 0; i < vm.list.length; i++) {
            if (vm.list[i].takeDate.indexOf(val) > -1) {
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
        vm.getDraw()
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

  .draw-list-con {
    .rel;
    height: 100%;
    .search-con {
      .vux-search-box {
        top: 0 !important;
        position: fixed !important;
        z-index: 20;
      }
    }
    .draw-list {
      .vux-swipeout-button-primary {
        background: #5d5454;
      }
      .vux-1px-t:before {
        .none;
      }
      .inner-scroller {
        .borBox;
        padding: 44px 0 50px;
        .v-items {
          .borBox;
          /*height: 150/@rem;*/
          margin-bottom: 10/@rem;
          padding: 20/@rem 0;
          .bf;
          .wrap {
            padding: 0 20/@rem;
            img {
              .size(80, 80);
              .abs-center-vertical;
              left: 20/@rem;
              .borR(50%);
            }
            .info-con {
              .borBox;
              padding-left: 100/@rem;
              overflow: hidden;
              h3 {
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
                .fz(24);
                i {
                  font-style: normal;
                  .cdiy(@c2);
                }
                span {
                  &.withdraw {
                    .fr;
                    .c9;
                    .fz(22);
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
