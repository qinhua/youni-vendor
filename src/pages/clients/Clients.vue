<template>
  <div class="clients-con" v-cloak>
    <div class="search-con">
      <search
        @result-click="resultClick"
        @on-change="getResult"
        :results="results"
        v-model="value"
        placeholder="输入手机号、昵称等搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        ref="search"></search>
    </div>
    <div class="clients-list">
      <scroller class="inner-scroller" ref="clientScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <swipeout>
          <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in clients"
                         :data-id="item.id" :data-orderNumber="item.orderNumber" key="index">
            <div slot="right-menu">
              <!--<swipeout-button @click.native="onButtonClick('fav')" type="primary">yes</swipeout-button>-->
              <swipeout-button @click.native="onButtonClick('delete')" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <section class="v-items">
                <section class="wrap">
                  <img :src="item.imgurl">
                  <div class="info-con">
                    <h3>倪香菇</h3>
                    <div class="nums"><span>下单数：30</span><span>成交数：25</span></div>
                    <div class="progress">
                      <div style='width:150px;height:150px;'>
                        <x-progress :percent="35" :showCancel="false"></x-progress>
                      </div>
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
  import {Search, Swipeout, SwipeoutItem, SwipeoutButton, XProgress} from 'vux'
  import {clientApi} from '../../service/main.js'

  export default {
    name: 'clients-con',
    data() {
      return {
        sellerId: null,
        value: '',
        results: [],
        clients: [],
        isPosting: false,
        onFetching: false
      }
    },
    components: {Search, Swipeout, SwipeoutItem, SwipeoutButton, XProgress},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.sellerId = vm.$store.state.global.sellerId
      vm.getClients()
      vm.$nextTick(() => {
        vm.$refs.clientScroller.finishInfinite(true)
        vm.$refs.clientScroller.resize()
      })
    },
    computed: {},
    /*watch: {
      '$route'(to, from) {
      }
    },*/
    methods: {
      onButtonClick(type) {
        alert('on button click ' + type)
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      toAppraise(id) {
        this.$router.push({path: '/appraise' + (param ? '/' + param : '')})
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getClients()
          vm.$refs.clientScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getClients(true)
          vm.$refs.clientScroller.finishInfinite(true)
        }, 1000)
      },
      getClients(isLoadMore) {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(clientApi.list, {id: vm.sellerId}, 'POST', function (res) {
          var resD = res.data.itemList
          if (!isLoadMore) {
            vm.clients = resD
          } else {
            vm.clients.push(resD)
          }
          console.log(vm.clients, '客户数据')
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
          vm.loadData(orderApi.delOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      resultClick(item) {
        window.alert('you click the result item: ' + JSON.stringify(item))
      },
      getResult(val) {
        if (val) {
          this.results = []
          vm.getClients(false, val)
          for (let i = 0; i < vm.clients.length; i++) {
            this.results.push({title: vm.clients[i].productName})
          }
        }
      },
      onSubmit() {
        this.$refs.search.setBlur()
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
        vm.getClients()
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

  .clients-con {
    .rel;
    height: 100%;
    .search-con {
      .vux-search-box {
        top: 0 !important;
        position: fixed !important;
        z-index: 20;
      }
    }
  }

  .clients-list {
    .inner-scroller {
      .borBox;
      padding: 44px 0 50px;
      .v-items {
        .borBox;
        height: 150/@rem;
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
            padding: 0 14/@rem 0 100/@rem;
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
</style>
