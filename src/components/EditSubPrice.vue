<template>
  <div class="goods-edit-price-con" v-cloak>
    <div class="top-con">
      <group v-if="isEdit" v-cloak>
        <!--<x-input title="订奶月份：" placeholder="如：订1个月" required text-align="right" v-model="params.note"></x-input>-->
        <popup-picker title="订奶月份" :data="scopes" :columns="1" v-model="tmpScope"
                      @on-change="changeMonth"></popup-picker>
        <x-input title="赠送数量：" placeholder="默认0瓶" text-align="right" type="number"
                 v-model="params.extraNum" @on-focus="onFocus"></x-input>
        <x-input title="商品原价：" placeholder="商品原价(元)" required text-align="right" type="number"
                 v-model="params.originPrice" @on-focus="onFocus"></x-input>
        <!--<x-input title="销售数量：" placeholder="销售数量(瓶)" required text-align="right" type="number"
                 v-model="params.saleNum" @on-focus="onFocus"></x-input>-->
        <x-input title="销售价格：" placeholder="销售价格(元)" required text-align="right" type="number"
                 v-model="params.salePrice" @on-focus="onFocus"></x-input>
      </group>
      <div class="btn-group">
        <div v-if="!isEdit" v-cloak>
          <button type="button" class="btn btn-add" @click="add"><i class="fa fa-plus"></i>&nbsp;配置订购数量</button>
        </div>
        <div class="flex-con" v-else>
          <button type="button" class="btn btn-col btn-cancel" @click="clear(true)">取消</button>
          <button type="button" class="btn btn-col btn-clear" @click="clear(false)">清空</button>
          <button type="button" class="btn btn-col btn-sure" @click="update">保存</button>
        </div>
      </div>
    </div>

    <ul class="tags-list" v-if="tags.length">
      <h3><i class="fa fa-tags"></i>&nbsp;标签列表<span>左滑可编辑</span></h3>
      <swipeout>
        <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in tags"
                       :data-id="item.id" key="index">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('edit',item)" type="primary">编辑</swipeout-button>
            <swipeout-button @click.native="onButtonClick('delete',item.id)" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" class="demo-content vux-1px-t">
            <li>
              <p>{{index + 1}}.[ {{item.note}} ]</p>
              <div class="sub-con">
                <span>数量：<i>{{item.saleNum}}瓶{{item.extraNum ? '（赠' + item.extraNum + '瓶）' : ''}}</i></span>
                <span>原价：<i class="txt-del">{{item.originPrice}}元</i></span>
                <span>销售价：<i>{{item.salePrice}}元</i></span>
              </div>
            </li>
          </div>
        </swipeout-item>
      </swipeout>
    </ul>
    <button class="btn btn-save" @click="finish"><i class="fa fa-check-square-o"></i>&nbsp;完成</button>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {
    Group,
    Cell,
    XInput,
    PopupPicker,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  } from 'vux'
  import {goodsApi, commonApi} from '../service/main.js'

  export default {
    name: 'goods-edit-price',
    data() {
      return {
        onFetching: false,
        isPosting: false,
        isEdit: false,
        limit: 8,
        tags: [],
        scopes: [{key: 0, value: '请选择', name: '请选择'}],
        tmpScope: ['请选择'],
        params: {
          goodsId: null,
          months: null,
          extraNum: null,
          originPrice: null,
          salePrice: null
        }
      }
    },
    props: ['goodsId', 'isAddGoods'],
    components: {
      Group,
      Cell,
      XInput,
      PopupPicker,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getTags()
    },
    watch: {
      '$route'(to, from) {
        vm.getTags()
      }
    },
    methods: {
      onFocus(val) {
        // console.log(val)
      },
      switchData(data, value, target) {
        let tmp
        if (!me.isArray(value)) {
          tmp = []
          for (let i = 0; i < data.length; i++) {
            if (value === data[i].key) {
              tmp = [data[i].name]
            }
          }
          vm[target] = tmp
        } else {
          tmp = null
          let tt = value.join('')
          for (let i = 0; i < data.length; i++) {
            if (tt === data[i].name) {
              tmp = data[i].key
            }
          }
          vm.params[target] = tmp
        }
      },
      changeMonth(val) {
        vm.switchData(vm.scopes, vm.tmpScope, 'months')
      },
      add() {
        if (vm.tags.length > vm.limit) {
          vm.toast('最多' + vm.limit + '个标签！', 'warn')
          return false
        }
        vm.isEdit = true
      },
      clear(isCancel) {
        vm.params = {
          gooodsId: vm.goodsId,
          months: null,
          extraNum: null,
          originPrice: null,
          salePrice: null
        }
        vm.tmpScope = ['请选择']
        vm.isEdit = !isCancel
      },
      edit(data) {
        vm.isEdit = true
        vm.params = data
        vm.switchData(vm.scopes, vm.params.months, 'tmpScope')
      },
      del(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '', function () {
          vm.isPosting = true
          vm.loadData(goodsApi.delSaleConfig, {id: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.getTags()
          }, function () {
            vm.isPosting = false
          }, true)
        })
      },
      generateMonth() {
        for (var i = 1; i < 100; i++) {
          vm.scopes.push({key: i, value: i + '个月', name: i + '个月'})
        }
      },
      getTags() {
        if (!vm.goodsId) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(goodsApi.saleConfigList, {goodsId: vm.goodsId}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          vm.tags = res.data.itemList
          vm.generateMonth()
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        }, true)
      },
      validate() {
        if (!vm.params.months) {
          vm.toast('请选择月份！', 'warn')
          return false
        }
        if (!vm.params.originPrice) {
          vm.toast('请输入原价！', 'warn')
          return false
        }
        /*if (!vm.params.saleNum) {
         vm.toast('请输入数量！', 'warn')
         return false
         }*/
        if (!vm.params.salePrice) {
          vm.toast('请输入销售价格！', 'warn')
          return false
        }
        return true
      },
      update() {
        if (vm.isPosting) return false
        if (vm.validate()) {
          vm.isPosting = true
          vm.processing()
          if (this.goodsId) {
            vm.params.goodsId = this.goodsId
          }
          vm.loadData(goodsApi.setSaleConfig, vm.params, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.isEdit = false
              vm.processing(0, 1)
              vm.getTags()
              vm.tmpScope = ['请选择']
              vm.clear(true)
            } else {
              vm.toast(res.data || '保存失败！', 'warn')
            }
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          }, true)
        }
      },
      finish() {
        if (vm.isEdit) {
          vm.toast('请先完成标签！', 'warn')
          return false
        }
        if (vm.isAddGoods) {
          vm.toast('已添加')
          vm.jump('goods')
        } else {
          vm.$emit('on-finish', {status: false, message: vm.tags.length ? '已添加个' + vm.tags.length + '标签' : '去设置'})
        }
      },
      onButtonClick(type, data) {
        if (type === 'edit') {
          vm.edit(data)
        } else {
          vm.del(data)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .goods-edit-price-con {
    padding-bottom: 50px;
    .bottom {
      margin-top: 10/@rem;
    }

    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
      }
      .checker-group {
        .rel;
        .flex;
        padding: 24/@rem 30/@rem;
        .fz(26);
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 15px;
          right: 0;
          height: 1px;
          border-top: 1px solid #D9D9D9;
          color: #D9D9D9;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
        label {
          .abs-center-vertical;
        }
        .vux-checker-box {
          .flex-r(1);
          .vux-checker-item {
            .fr;
            margin-left: 4px;
          }
        }
      }
      .tags-group {
        .rel;
        padding: 24/@rem 10/@rem;
        .fz(26);
        label {
          .block;
          width: 100%;
          padding-bottom: 18/@rem;
        }
        .tags-cons {
          .borBox;
        }
        .tags-input {
          .bf5;
          .tag {
            .cf;
            .bdiy(#ef834f)
          }
        }
      }
      .upload-group {
        .rel;
        padding: 0 30/@rem;
        .fz(26);
        #uploader {
          margin-top: 0;
          .weui-cell {
            padding: 10px 0;
          }
          &:after {
            .none;
          }
        }
      }
      .editor-group {
        .rel;
        padding: 24/@rem 10/@rem;
        .fz(26);
        .bor-t;
        label {
          .block;
          width: 100%;
          padding-bottom: 18/@rem;
        }
        .ql-toolbar {
          padding: 8px 0;
        }
        .ql-editor {
          /*-webkit-user-select:text;*/
          /*user-select:text;*/

        }
      }
      .vux-x-input, .address-area, .vux-selector, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }

    .btn-group {
      margin-top: 12/@rem;
      padding: 0 10/@rem;
      overflow: hidden;
      button {
        .fz(22);
        padding: 20/@rem 0;
        .borR(4px);
      }
      /*.flex-con{}
      .btn-col{}*/
      .btn-add {
        width: 100%;
        .cdiy(#7bb771);
        .bdiy(#f5f5f5);
        .bor(1px, solid, #7bb771);
      }
      .btn-cancel {
        .fl;
        width: 30%;
        .c6;
        .bdiy(#ccc) !important;
      }
      .btn-clear {
        .fl;
        width: 30%;
        margin-left: 5%;
        .c6;
        .bdiy(#e8d86d) !important;
      }
      .btn-sure {
        .fr;
        width: 30%;
        .cf;
        .bdiy(#68c348);
      }
    }

    .tags-list {
      .borBox;
      margin-top: 20/@rem;
      .bf;
      .bor-t(2px, solid, #eadbd5);
      .vux-swipeout-button-primary {
        background: orange;
      }
      h3 {
        padding: 12/@rem;
        .fz(24);
        background: #f9f0ed;
        span {
          .fr;
          font-weight: normal;
          .fz(22);
          .c8;
        }
      }
      li {
        .rel;
        padding: 20/@rem;
        .bor-b;
        p {
          .borBox;
          .c3;
          .fz(26);
          .ellipsis-clamp-2;
        }
        .sub-con {
          overflow: hidden;
          span {
            .fl;
            margin: 10/@rem 20/@rem 0 0;
            .c7;
            .fz(24);
            i {
              font-style: normal;
              .cdiy(@c2);
            }
          }
        }
      }
    }

    .btn-save {
      .fix;
      bottom: 0;
      z-index: 20;
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
  }

  .demo-item {
    border: 1px solid #ececec;
    padding: 4px 15px;
    .borR(4px);
  }

  .demo-item-selected {
    .cdiy(#f34c18);
    border: 1px solid #f34c18;
  }
</style>
