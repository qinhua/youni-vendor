<template>
  <div class="goods-edit-con" v-cloak>
    <group>
      <popup-picker title="品牌" :data="brands" :columns="1" v-model="tmpBrand" ref="picker1" @on-show=""
                    @on-hide="" @on-change="changeBrand"></popup-picker>
      <x-input title="商品名称：" placeholder="商品名称" required text-align="right" v-model="params.name"></x-input>
      <!--<selector placeholder="商品分类" v-model="params.goodsType" title="商品分类" name="goodsType" :options="types"-->
      <!--@on-change="changeType"></selector>-->
      <popup-picker title="商品分类" :data="types" :columns="1" v-model="tmpType" ref="picker2" @on-show=""
                    @on-hide="" @on-change="changeType"></popup-picker>
      <popup-picker title="商品类目" :data="categories" :columns="1" v-model="tmpCat" ref="picker3" @on-show=""
                    @on-hide="" @on-change="changeCategory"></popup-picker>
      <x-input title="库存：" placeholder="库存" required text-align="right" v-model="params.stock"></x-input>
      <x-input title="价格：" placeholder="价格" required text-align="right" v-model="params.price"></x-input>
    </group>
    <group class="bottom">
      <div class="checker-group">
        <label>销售状态：</label>
        <checker v-model="params.saleStatus" default-item-class="demo-item" selected-item-class="demo-item-selected">
          <checker-item :value="item.key" v-for="(item, index) in status" :key="index" @on-item-click="changeStatus">
            {{item.value}}
          </checker-item>
        </checker>
      </div>
      <img-uploader title="商品头图" :api="fileApi" :limit="1" @on-uploaded="getImgUrl"></img-uploader>
      <!--<x-input title="折扣价：" placeholder="折扣价" text-align="right" v-model="params.discountPrice"></x-input>
      <x-textarea title="折扣说明：" :max="20" placeholder="折扣说明" @on-blur="" v-model="params.discountNote"
                  show-clear></x-textarea>-->
    </group>
    <group class="bottom">
      <div class="tags-group">
        <label>商品标签</label>
        <div class="tags-cons">
          <tags-input :tags="tags" placeholder="商品标签（3~5字最佳）" @focus="handleFocus" @blur="handleBlur"
                      @tags-change="changeTags"></tags-input>
        </div>
      </div>
      <div class="editor-group">
        <label>商品详情</label>
        <vue-editor v-model="params.note" placeholder="我是示例文字…" useCustomImageHandler @imageAdded="handleImageAdded"
                    :editorToolbar="customToolbar"></vue-editor>
      </div>
      <!--<x-textarea title="详情：" :max="20" placeholder="详情" @on-blur="" v-model="params.note" show-clear></x-textarea>-->
      <!--<x-address class="address-area" title="所在地区" @on-hide="logHide" @on-shadow-change="changeArea" :list="addressData"
                 placeholder="请选择地区">
        <template slot="title" scope="props">
        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
          <span style="vertical-align:middle;">所在地区：</span>
        </span>
        </template>
      </x-address>
      <x-input title="详细地址：" placeholder="输入详细地址" required v-model="detailAddress"></x-input>-->
    </group>
    <div class="btn btn-save" @click="updateGoods"><i class="fa fa-save"></i>&nbsp;保存</div>
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
    Checker,
    CheckerItem,
    Selector,
    PopupPicker,
    XTextarea,
    XAddress,
    ChinaAddressV3Data
  } from 'vux'
  import imgUploader from '../../components/ImgUploader.vue'
  import {VueEditor} from 'vue2-editor'
  import {goodsApi, commonApi} from '../../service/main.js'

  export default {
    name: 'goods-edit',
    data() {
      return {
        onFetching: false,
        isPosting: false,
        lineData: null,
        fileApi: commonApi.uploadImg,
        addressData: ChinaAddressV3Data,
        brands: [{
          key: '028283447c4311e7aa18d8cb8a971933',
          value: '一方人',
          name: '一方人'
        }, {
          key: '038283447c4311e7aa18d8cb8a971936',
          value: '娃哈哈',
          name: '娃哈哈'
        }, {
          key: '018283447c4311e7aa18d8cb8a941930',
          value: '蒙牛',
          name: '蒙牛'
        }, {
          key: '038283447c4311e7aa18d8cb8a941939',
          value: '康师傅',
          name: '康师傅'
        }, {
          key: '058283447c4311e7aa18d8cb8a971935',
          value: '花果山',
          name: '花果山'
        }, {
          key: '028283447c4311e7ab18d8cb8a971932',
          value: '怡宝',
          name: '怡宝'
        }, {
          key: '018283447c4311e7aa18d8cb8a971932',
          value: '百岁山',
          name: '百岁山'
        }, {
          key: '068283447c4311e7aa18d8cb8a971943',
          value: '昆仑山',
          name: '昆仑山'
        }],
        types: [{key: 'goods_type.1', value: '水', name: '水'}, {
          key: 'goods_type.2',
          value: '奶',
          name: '奶'
        }, {key: 'goods_type.3', value: '水票', name: '水票'}],
        categories: [{key: 'goods_category.1', value: '瓶装', name: '瓶装'}, {
          key: 'goods_category.2',
          value: '桶装',
          name: '桶装'
        }, {key: 'goods_category.3', value: '其它', name: '其它'}],
        status: [{key: 1, value: '在售'}, {key: 2, value: '停售'}],
        params: {
          brandId: null,
          name: '',
          type: 1,
          category: 2,
          stock: '',
          price: null,
          imgurl: '',
          saleStatus: 1,
          label: '',
          /*discountPrice: null,
           discountNote: '',*/
          note: ''
        },
        tags: ['标签一'],
        tmpBrand: [],
        tmpType: [],
        tmpCat: [],
        customToolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          [{'color': []}, {'background': []}],
          [{'align': []}, {'list': 'ordered'}, {'list': 'bullet'}],
          ['image']
        ]
      }
    },
    components: {
      Group,
      Cell,
      XInput,
      Checker,
      CheckerItem,
      Selector,
      PopupPicker,
      XTextarea,
      XAddress,
      ChinaAddressV3Data,
      VueEditor,
      imgUploader,
      'tags-input': require('vue-tagsinput/src/input.vue')
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      // vm.params.sellerId = vm.$store.state.global.sellerId
      vm.getGoods()
    },
    computed: {},
    watch: {
      '$route'(to, from) {
        vm.getGoods()
      }
    },
    methods: {
      getImgUrl(data) {
        if (me.isArray(data)) {
          vm.params.imgurl = data.join(',')
        } else {
          vm.params.imgurl = ''
        }
      },
      switchData(data, value, target, isUpdate) {
        let tmp
        if (isUpdate) {
          tmp = []
          for (let i = 0; i < data.length; i++) {
            if (value === data[i].key) {
              tmp.push(data[i].name)
            }
          }
          vm[target] = tmp
        } else {
          let tt = value.join('')
          for (let i = 0; i < data.length; i++) {
            if (tt === data[i].name) {
              tmp = data[i].key
            }
          }
          vm.params[target] = tmp
        }
      },
      getGoods() {
        vm.lineData = vm.$route.query.linedata ? JSON.parse(decodeURIComponent(vm.$route.query.linedata)) : ''
        console.log(vm.lineData)
        if (vm.lineData&&vm.lineData.id) {
          vm.params = {
            id: vm.lineData.id,
            brandId: vm.lineData.brandId,
            name: vm.lineData.name,
            type: vm.lineData.type,
            category: vm.lineData.category,
            stock: vm.lineData.stock,
            price: vm.lineData.price,
            imgurl: vm.lineData.imgurl,
            saleStatus: vm.lineData.saleStatus,
            label: null,
            /*discountPrice: null,
             discountNote: '',*/
            note: vm.lineData.note
          }
          vm.switchData(vm.brands, vm.lineData.brandId, 'tmpBrand', 1)
          vm.switchData(vm.types, vm.lineData.type, 'tmpType', 1)
          vm.switchData(vm.categories, vm.lineData.category, 'tmpCat', 1)
          vm.renderTags(vm.lineData.label)
        }else{
          vm.params={
              brandId: null,
              name: '',
              type: 1,
              category: 2,
              stock: '',
              price: null,
              imgurl: '',
              saleStatus: 1,
              label: '',
              note: ''
          }
          vm.tags= ['标签一']
          vm.tmpBrand=[]
          vm.tmpType= []
          vm.tmpCat= []
        }
        /*if (vm.onFetching) return false
        vm.onFetching = true
        vm.loadData(goodsApi.list, {id: vm.params.id}, 'POST', function (res) {
          if (res) {
            let resD = res.data.itemList
            /!*此处转换一些字段类型*!/
            // a.比如把type和goodsCategory转换成数组
            vm.switchData(vm.types, vm.params.type, 'tmpType')
            vm.switchData(vm.categories, vm.params.category, 'tmpCat')
            vm.renderTags(resD.label)
            vm.goods = resD
            console.log(vm.goods)
          }
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })*/
      },
      validate() {
        if (vm.params.brandId === '') {
          vm.toast('请选择品牌！','warn')
          return false
        }
        if (!vm.params.name) {
          vm.toast('请填写商品名！','warn')
          return false
        }
        if (!vm.params.type) {
          vm.toast('请选择商品分类！','warn')
          return false
        }
        if (!vm.params.category) {
          vm.toast('请选择商品类目！','warn')
          return false
        }
        if (!vm.params.stock) {
          vm.toast('请输入库存！','warn')
          return false
        }
        if (!vm.params.price) {
          vm.toast('请指定价格！','warn')
          return false
        }
        if (!vm.params.note) {
          vm.toast('请填写商品详情！','warn')
          return false
        }
        return true
      },
      updateGoods() {
        if (vm.isPosting || !vm.validate()) return false
        /*此处转换一些字段类型*/
        let curApi
        vm.formatNewTag()
        if (vm.lineData.id) {
          curApi = goodsApi.update
        } else {
          curApi = goodsApi.add
        }
        console.log('最后选择的数据：', vm.params)
        vm.isPosting = true
        vm.processing()
        vm.loadData(curApi, vm.params, 'POST', function (res) {
          vm.processing(0, 1)
          vm.toast(' ')
          vm.$router.back()
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      logHide(str) {
        console.log('on-hide', str)
      },
      changeArea(ids, names) {
        console.log(ids, names)
        vm.params.province = ids[0]
        vm.params.city = ids[1]
      },
      changeBrand(val) {
        vm.switchData(vm.brands, vm.tmpBrand, 'brandId')
        console.log(val, vm.params.brandId)
      },
      changeType(val) {
        vm.switchData(vm.types, vm.tmpType, 'type')
        console.log(val, vm.params.type)
      },
      changeStatus(value, disabled) {
        // console.log(value, disabled)
      },
      changeCategory(val) {
        vm.switchData(vm.categories, vm.tmpCat, 'category')
        console.log(val, vm.params.category)
      },
      changeTags(index, text) {
        console.log(index, text)
        if(index===3){
          vm.toast('最多3个标签！','warn')
          return
        }
        if (text) {
          this.tags.splice(index, 0, text)
        } else {
          this.tags.splice(index, 1)
        }
      },
      handleFocus(index) {
        // console.log(`input actived in the index ${index}`)
      },
      handleBlur(index) {
        // console.log(`input deactived in the index ${index}`)
      },
      renderTags(tags) {
        vm.tags = tags ? tags.split(',') : null
      },
      formatNewTag(text) {
        vm.params.label = vm.tags ? vm.tags.join(',') : ''
      },
      handleImageAdded: function (file, Editor, cursorLocation) {
        // An example of using FormData
        // NOTE: Your key could be different such as:
        // formData.append('file', file)
        var formData = new FormData();
        formData.append('image', file)
        vm.loadData(commonApi.uploadImg, formData, 'POST', function (res) {
          let url = res.data.url // Get url from response
          console.log(res)
          Editor.insertEmbed(cursorLocation, 'image', url);
          vm.$router.back()
          vm.isPosting = false
          vm.processing(0, 1)
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .goods-edit-con {
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
