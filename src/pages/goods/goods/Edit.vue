<template>
  <div class="goods-edit-con" v-cloak>
    <div class="edit-con" v-if="!editPriceTag">
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
        <x-input title="库存：" placeholder="库存" required text-align="right" type="number"
                 v-model="params.stock"></x-input>
        <x-input title="价格：" placeholder="价格" required text-align="right" type="number" v-model="params.price"
                 v-if="params.type==='goods_type.1'"></x-input>
        <x-input title="价格标签" v-model="priceStatusText" text-align="right" readonly disabled
                 v-if="isEdit && params.type==='goods_type.2'"
                 @click.native="editSubPrice(params.priceTags)"></x-input>
        <div class="tags-group favor-group" v-if="params.type==='goods_type.2'">
          <label>口味标签：</label>
          <div class="tags-cons">
            <tags-input :tags="flavourLabel" placeholder="口味标签（3~5字最佳,最多5个）" @focus="handleFocus" @blur="handleBlur"
                        @tags-change="changeFavorTags"></tags-input>
          </div>
        </div>
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
        <img-uploader ref="imgPicker" title="商品头图" :api="fileApi" :limit="1" @on-uploaded="getImgUrl"></img-uploader>
        <!--<x-input title="折扣价：" placeholder="折扣价" text-align="right" v-model="params.discountPrice"></x-input>
        <x-textarea title="折扣说明：" :max="20" placeholder="折扣说明" @on-blur="" v-model="params.discountNote"
                    show-clear></x-textarea>-->
      </group>
      <group class="bottom">
        <div class="tags-group">
          <label>标签</label>
          <div class="tags-cons">
            <tags-input :tags="label" placeholder="商品标签（3~5字最佳,最多3个）" @focus="handleFocus" @blur="handleBlur"
                        @tags-change="changeTags"></tags-input>
          </div>
        </div>
        <div class="editor-group">
          <label>详情</label>
          <vue-editor v-model="params.note" placeholder="我是示例文字…" useCustomImageHandler @imageAdded="handleImageAdded"
                      :editorToolbar="customToolbar"></vue-editor>
        </div>
      </group>
      <div class="btn btn-nextstep" @click="updateGoods(true)" v-if="!isEdit && params.type!=='goods_type.1'">
        &nbsp;下一步
      </div>
      <div class="btn btn-save" @click="updateGoods" v-else><i class="fa fa-save"></i>&nbsp;保存</div>
    </div>
    <edit-sub-price :goodsId="params.id" :isAddGoods="!isEdit" v-if="editPriceTag"
                    @on-finish="getPriceTagStatus"></edit-sub-price>
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
  import ImgUploader from '../../../components/ImgUploader.vue'
  import EditSubPrice from '../../../components/EditSubPrice.vue'
  import {VueEditor} from 'vue2-editor'
  import {goodsApi, commonApi} from '../../../service/main.js'

  export default {
    name: 'goods-edit',
    data() {
      return {
        onFetching: false,
        isPosting: false,
        lineData: null,
        isEdit: false,
        editPriceTag: false,
        priceStatusText: '去设置',
        fileApi: commonApi.uploadImg,
        addressData: ChinaAddressV3Data,
        brands: [{
          key: 1,
          value: '怡宝',
          name: '怡宝'
        }, {
          key: 2,
          value: '康师傅',
          name: '康师傅'
        }, {
          key: 3,
          value: '百岁山',
          name: '百岁山'
        }, {
          key: 4,
          value: '花果山',
          name: '花果山'
        }, {
          key: 5,
          value: '水老官',
          name: '水老官'
        }, {
          key: 6,
          value: '一方人',
          name: '一方人'
        }, {
          key: 7,
          value: '农夫山泉',
          name: '农夫山泉'
        }, {
          key: 8,
          value: '八宝山',
          name: '八宝山'
        }, {
          key: 9,
          value: '昆仑山',
          name: '昆仑山'
        }],
        types: [{key: 'goods_type.1', value: '水', name: '水'}, {
          key: 'goods_type.2',
          value: '奶',
          name: '奶'
        }],
        categories: [{key: 'goods_category.1', value: '瓶装', name: '瓶装'}, {
          key: 'goods_category.2',
          value: '桶装',
          name: '桶装'
        }, {key: 'goods_category.3', value: '其它', name: '其它'}],
        status: [{key: 1, value: '在售'}, {key: 2, value: '停售'}],
        params: {
          brandId: null,
          name: '',
          type: 'goods_type.1',
          category: '',
          stock: 0,
          price: 0,
          imgurl: '',
          saleStatus: 1,
          label: '',
          flavourLabel: '',
          /*discountPrice: null,
           discountNote: '',*/
          note: ''
        },
        label: [],
        flavourLabel: [],
        tmpBrand: [],
        tmpType: [],
        tmpCat: [],
        customToolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          [{'color': []}, {'background': []}],
          [{'align': []}, {'list': 'ordered'}, {'list': 'bullet'}],
          ['image']
        ],
        editorOption: {
          // some quill options
        },
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
      EditSubPrice,
      ImgUploader,
      'tags-input': require('vue-tagsinput/src/input.vue')
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getGoods()
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    watch: {
      '$route'(to, from) {
        vm.getGoods()
      }
    },
    methods: {
      getImgUrl(data) {
        if (me.isArray(data) && data.length) {
          vm.params.imgurl = data.join(',')
        } else {
          vm.params.imgurl = ''
        }
        console.log(vm.params.imgurl)
      },
      switchData(data, value, target, isUpdate) {
        let tmp
        if (isUpdate) {
          tmp = []
          for (let i = 0; i < data.length; i++) {
            if (value == data[i].key) {
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
      getPriceTagStatus(data) {
        vm.editPriceTag = data.status
        vm.priceStatusText = data.message
      },
      getGoods() {
        vm.editPriceTag = false
        vm.lineData = vm.$route.query.linedata ? JSON.parse(decodeURIComponent(vm.$route.query.linedata)) : ''
        vm.isEdit = vm.lineData.id ? true : false
        if (vm.lineData && vm.lineData.id) {
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
            label: '',
            flavourLabel: '',
            /*discountPrice: null,
             discountNote: '',*/
            note: vm.lineData.note
          }
          vm.switchData(vm.brands, vm.lineData.brandId, 'tmpBrand', 1)
          vm.switchData(vm.types, vm.lineData.type, 'tmpType', 1)
          vm.switchData(vm.categories, vm.lineData.category, 'tmpCat', 1)
          vm.renderTags('label', vm.lineData.label)
          vm.renderTags('flavourLabel', vm.lineData.flavourLabel)
        } else {
          vm.params = {
            brandId: '',
            name: '',
            type: 'goods_type.1',
            category: '',
            stock: 0,
            price: 0,
            imgurl: '',
            saleStatus: 1,
            label: '',
            flavourLabel: '',
            note: ''
          }
          vm.label = []
          vm.flavourLabel = []
          vm.tmpBrand = []
          vm.tmpType = ['水']
          vm.tmpCat = []
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
          vm.toast('请选择品牌！', 'warn')
          return false
        }
        if (!vm.params.name) {
          vm.toast('请填写商品名！', 'warn')
          return false
        }
        if (!vm.params.type) {
          vm.toast('请选择商品分类！', 'warn')
          return false
        }
        if (!vm.params.category) {
          vm.toast('请选择商品类目！', 'warn')
          return false
        }
        if (!vm.params.stock) {
          vm.toast('请输入库存！', 'warn')
          return false
        }
        if (!vm.params.price) {
          vm.toast('请指定价格！', 'warn')
          return false
        }
        /*if (!vm.params.imgurl) {
         vm.toast('请上传商品图片！', 'warn')
         return false
         }*/
        /*if (!vm.params.note) {
         vm.toast('请填写商品详情！', 'warn')
         return false
         }*/
        return true
      },
      updateGoods(isMilk) {
        if (vm.isPosting || !vm.validate()) return false
        let curApi
        if (vm.isEdit) {
          curApi = goodsApi.update
        } else {
          curApi = goodsApi.add
        }
        console.log('最后选择的数据：', vm.params)
        /*此处转换一些字段类型*/
        vm.formatNewTag('label')
        vm.formatNewTag('flavourLabel')
        vm.isPosting = true
        vm.processing()
        vm.loadData(curApi, vm.params, 'POST', function (res) {
          vm.processing(0, 1)
          vm.isPosting = false
          if (res.success) {
            if(res.data){
              if (!isMilk) {
                vm.toast('已添加')
                vm.jump('goods')
              } else {
                vm.params.id = res.data.id
                vm.editPriceTag = true
              }
            }else{
              vm.toast('已更新')
              vm.jump('goods')
            }
          }
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
        if (vm.params.type === 'goods_type.2') {
          vm.params.price = 1
        } else {
          vm.params.price = 0
        }
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
        if (index === 3) {
          vm.toast('最多3个标签！', 'warn')
          return
        }
        if (text) {
          this.label.splice(index, 0, text)
        } else {
          this.label.splice(index, 1)
        }
      },
      changeFavorTags(index, text) {
        console.log(index, text)
        if (index === 5) {
          vm.toast('最多5个标签！', 'warn')
          return
        }
        if (text) {
          this.flavourLabel.splice(index, 0, text)
        } else {
          this.flavourLabel.splice(index, 1)
        }
      },
      editSubPrice(data) {
        vm.editPriceTag = true
      },
      handleFocus(index) {
        // console.log(`input actived in the index ${index}`)
      },
      handleBlur(index) {
        // console.log(`input deactived in the index ${index}`)
      },
      renderTags(key, value) {
        vm[key] = value ? value.split(',') : []
      },
      formatNewTag(key) {
        vm.params[key] = vm[key] ? vm[key].join(',') : ''
        vm.params[key] = vm[key] ? vm[key].join(',') : ''
      },
      /*富文本editor*/
      handleImageAdded: function (file, Editor, cursorLocation) {
        // An example of using FormData
        // NOTE: Your key could be different such as:
        var formData = new FormData();
        formData.append('image', file)
        vm.$axios({
          url: commonApi.uploadImg,
          method: 'POST',
          data: formData
        }).then(function (result) {
          var url = window.youniMall.host + '/' + result.data.imageUrl
          Editor.insertEmbed(cursorLocation, 'image', url);
        }).catch(function (err) {
          console.log(err);
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

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
        &.favor-group {
          margin-left: 24/@rem;
          padding: 24/@rem 28/@rem 24/@rem 0;
          .bor-t;
          .tags-input {
            .tag {
              .bdiy(#79bd5c)
            }
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
    .btn-nextstep {
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
      .bdiy(#35b956);
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
