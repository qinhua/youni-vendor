<template>
  <div class="deposite-con" v-cloak>
    <div class="search-con">
      <search
        @result-click="resultClick"
        @on-change="getResult"
        v-model="value"
        placeholder="输入昵称搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        ref="search"></search>
    </div>
    <div class="deposite-list">
      <scroller class="inner-scroller" ref="depositeScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <swipeout>
          <swipeout-item disabled @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in results"
                         :data-id="item.userId" key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('block',item.id)" type="primary">退还</swipeout-button>
              <!--<swipeout-button @click.native="onButtonClick('delete',item.id)" type="warn">删除</swipeout-button>-->
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <section class="v-items">
                <section class="wrap">
                  <img :src="item.headimgurl">
                  <div class="info-con">
                    <h3>{{item.nickname}}</h3>
                    <div class="nums"><span>总押金：￥{{item.totalAmount|toFixed}}</span><span>桶数：{{item.bucketNum}}</span>
                    </div>
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
  import {clientApi} from '../../service/main.js'

  export default {
    name: 'deposite-con',
    data() {
      return {
        value: '',
        results: [],
        list: [],
        isPosting: false,
        onFetching: false,
        noMore: false,
        params: {
          pageSize: 10,
          pageNo: 1
        }
      }
    },
    components: {Search, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getDeposite()
      vm.$nextTick(function () {
        vm.$refs.depositeScroller.finishInfinite(true)
        vm.$refs.depositeScroller.resize()
      })
    },
    /*computed: {},
     watch: {
     '$route'(to, from) {
     }
     },*/
    methods: {
      onButtonClick(type, id) {
        if (type === 'delete') {
          vm.del(id)
        } else {
          vm.block(id)
        }
      },
      toAppraise(id) {
        this.$router.push({path: '/appraise' + (param ? '/' + param : '')})
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getDeposite()
          vm.$refs.depositeScroller.finishPullToRefresh()
        }, 1000)
      },
      infinite(done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getDeposite(true)
          vm.$refs.depositeScroller.finishInfinite(true)
        }, 1000)
      },
      getDeposite(isLoadMore) {
        if (vm.onFetching) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.onFetching = true
        vm.loadData(clientApi.depositList, vm.params, 'POST', function (res) {
          vm.onFetching = false
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
          // console.log(vm.list, '客户数据')
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      block(id) {
        if (vm.isPosting) return false
        vm.confirm('确认屏蔽此客户？', null, function () {
          vm.isPosting = true
          vm.loadData(clientApi.block, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
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
          // vm.getDeposite()
          for (let i = 0; i < vm.list.length; i++) {
            if (vm.list[i].nickname.indexOf(val) > -1) {
              vm.results.push(vm.list[i])
            }
          }
        } else {
          vm.results = vm.list
        }
      },
      onSubmit() {
        this.$refs.search.setBlur()
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
        vm.getDeposite()
      },
      onFocus() {
        console.log('on focus')
      },
      onCancel() {
        console.log('on cancel')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .deposite-con {
    .rel;
    height: 100%;
    .search-con {
      .vux-search-box {
        top: 0 !important;
        position: fixed !important;
        z-index: 20;
      }
    }

    .deposite-list {
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
              }
              .nums {
                .fz(22);
                span {
                  padding-right: 20/@rem;
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
