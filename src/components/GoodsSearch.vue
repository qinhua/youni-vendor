<template>
  <div class="goods-search-con" v-cloak>
    <div class="search-con">
      <search
        @result-click="resultClick"
        @on-change="getResult"
        v-model="curVal"
        placeholder="输入商品名搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        ref="search"></search>
    </div>
    <div class="goods-list">
      <scroller class="inner-scroller" ref="goodsScroller" height="100%" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText="没有更多数据"
                snapping>
        <!-- content goes here -->
        <section class="v-items" v-for="(item, index) in results" :data-id="item.id"
                 @click="onSelect({id:item.id,name:item.name})">
          <section class="item-middle">
            <div class="img-con"
                 :style="item.imgurl?('background-image:url('+item.imgurl+')'):''"></div>
            <div class="info-con">
              <h3><span
                :class="item.type==='goods_type.2'?'milk':''">{{item.type === 'goods_type.2' ? '奶' : '水'}}</span>{{item.name}}
              </h3>
              <section class="middle">
                <span class="unit-price">售价：￥{{item.price}}</span>
                <span class="order-info">已售：{{item.saleCount}}</span>
              </section>
              <!--<label>库存：{{item.stock}}件</label>-->
            </div>
            <!-- <div class="price-con">
             <p class="price">￥{{item.price}}</p>
             <p class="buy-count">x{{item.buyCount}}</p>
             </div>-->
          </section>
        </section>
      </scroller>
    </div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Search} from 'vux'
  import {goodsApi} from '../service/main.js'

  export default {
    name: 'goods-search',
    data() {
      return {
        goods: [],
        curVal: '',
        results: [],
        params: {
          goodsType: 'goods_type.1',
          pageSize: 10,
          pageNo: 1,
          saleStatus: 1
        },
        noMore: false,
        isPosting: false
      }
    },
    components: {Search},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getGoods()
      vm.$nextTick(function() {
        vm.$refs.goodsScroller.finishInfinite(true)
        vm.$refs.goodsScroller.resize()
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
      onSelect(data) {
        this.$emit('on-select', data)
      },
      getGoods(isLoadMore, status) {
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.isPosting = true
        vm.processing()
        vm.loadData(goodsApi.list, vm.params, 'POST', function (res) {
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
            resD.itemList.length ? vm.goods.concat(resD.itemList) : vm.noMore = true
          }
          vm.results = vm.goods
          // console.log(vm.goods, '商品数据')
        }, function () {
          vm.isPosting = false
        })
      },
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getGoods()
          vm.$refs.goodsScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getGoods(true)
          vm.$refs.goodsScroller.finishInfinite(true)
        }, 1000)
      },
      resultClick(item) {
        window.alert('you click the result item: ' + JSON.stringify(item))
      },
      getResult(val) {
        if (val) {
          vm.results = []
          // vm.getGoods()
          for (let i = 0; i < vm.goods.length; i++) {
            if (vm.goods[i].name.indexOf(val) > -1) {
              vm.results.push(vm.goods[i])
            }
          }
        } else {
          vm.results = vm.goods
        }
      },
      onSubmit() {
        this.$refs.search.setBlur()
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
        // vm.getGoods()
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
  @import '../../static/css/tools.less';

  .goods-search-con {
    .rel;
    height: 100%;
    .search-con {
      .vux-search-box {
        top: 0 !important;
        position: fixed !important;
        z-index: 20;
      }
    }

    .goods-list {
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
            .rel;
            padding: 14/@rem 20/@rem 14/@rem 14/@rem;
            min-height: 140/@rem;
            .bf;
            .bor-b;
            .img-con {
              .abs;
              top: 14/@rem;
              .size(140, 140);
              overflow: hidden;
              background: #f5f5f5 url(../../static/img/bg_nopic.jpg) no-repeat center;
              -webkit-background-size: cover;
              background-size: cover;
            }
            .info-con {
              .borBox;
              width: 100%;
              padding: 0 0 0 160/@rem;
              h3 {
                padding-bottom: 10/@rem;
                .txt-normal;
                .c3;
                .fz(26);
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
              .middle {
                .c9;
                .fz(24);
                .ellipsis-clamp-2;
                .unit-price {
                  padding-right: 40/@rem;
                  .cdiy(@c2);
                }
                .order-info{
                  .fr;
                }
              }
              label {
                .fz(20);
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
  }
    .weui-cells vux-search_show{
      .none!important;
    }

</style>
