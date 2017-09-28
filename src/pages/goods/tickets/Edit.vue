<template>
  <div class="goods-edit-con needsclick" v-cloak>
    <div class="wrap-con" v-show="!showGoodsList">
      <group>
        <x-input title="关联商品：" placeholder="关联商品" required readonly text-align="right" v-model="selGoodsName"
                 @click.native="chooseGoods"></x-input>
        <x-input title="水票名称：" placeholder="水票名称" required text-align="right" v-model="params.name"></x-input>
        <x-input title="水票价格：" placeholder="水票价格" required text-align="right" type="number"
                 v-model="params.price"></x-input>
        <x-input title="水票容量：" placeholder="可买几桶水" required text-align="right" type="number"
                 v-model="params.waterNum"></x-input>
        <popup-picker title="水票类型" :data="types" :columns="1" v-model="tmpType" ref="picker2" @on-show=""
                      @on-hide="" @on-change="changeType"></popup-picker>
        <!--<x-input title="库存：" placeholder="库存" required text-align="right" v-model="params.stock"></x-input>-->
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
        <img-uploader title="水票图片" :api="fileApi" :limit="1" @on-uploaded="getImgUrl"></img-uploader>
        <x-textarea title="水票说明：" :max="15" placeholder="水票说明(如买10桶送2桶)" @on-blur="" v-model="params.waterNote"
                    show-clear></x-textarea>
      </group>
      <group class="bottom">
        <!--<div class="tags-group">
          <label>标签</label>
          <div class="tags-cons">
            <tags-input :tags="tags" placeholder="商品标签（3~5字最佳,最多3个）" @focus="handleFocus" @blur="handleBlur"
                        @tags-change="changeTags"></tags-input>
          </div>
        </div>-->
        <div class="editor-group">
          <label>详情</label>
          <<<<<<< Updated upstream
          <!--<textarea id="editor"></textarea>-->
          <vue-editor class="needsclick" v-model="params.note" placeholder="我是示例文字…" useCustomImageHandler
                      @imageAdded="handleImageAdded"
                      :editorToolbar="customToolbar"></vue-editor>
          =======
          <textarea id="editor"></textarea>
          <!--<vue-editor class="needsclick" v-model="params.note" placeholder="我是示例文字…" useCustomImageHandler @imageAdded="handleImageAdded"
                      :editorToolbar="customToolbar"></vue-editor>-->
          >>>>>>> Stashed changes
        </div>
      </group>
      <div class="btn btn-save" @click="updateTicket"><i class="fa fa-save"></i>&nbsp;保存</div>
    </div>
    <goods-search @on-select="getGoodsData" v-show="showGoodsList"></goods-search>
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
  import goodsSearch from '../../../components/GoodsSearch.vue'
  import {VueEditor} from 'vue2-editor'
  /*import $ from 'jquery'
   import 'simditor/styles/simditor.css'
   import Simditor from 'simditor'*/
  import {ticketApi, commonApi} from '../../../service/main.js'

  export default {
    name: 'ticket-edit',
    data() {
      return {
        isPosting: false,
        lineData: null,
        showGoodsList: false,
        fileApi: commonApi.uploadImg,
        addressData: ChinaAddressV3Data,
        selGoodsName: '',
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
        types: [{
          'key': 'water_ticket_type.1',
          'value': '买5送1',
          'name': '买5送1'
        }, {
          'key': 'water_ticket_type.2',
          'value': '买10送2',
          'name': '买10送2'
        }, {
          'key': 'water_ticket_type.3',
          'value': '买100送30',
          'name': '买100送30'
        }, {
          'key': 'water_ticket_type.4',
          'value': '买100送35',
          'name': '买100送35'
        }, {
          'key': 'water_ticket_type.5',
          'value': '买100送40',
          'name': '买100送40'
        }],
        categories: [{key: 'goods_category.1', value: '瓶装', name: '瓶装'}, {
          key: 'goods_category.2',
          value: '桶装',
          name: '桶装'
        }, {key: 'goods_category.3', value: '其它', name: '其它'}],
        status: [{key: 1, value: '在售'}, {key: 2, value: '停售'}],
        params: {
          ticketType: 1,
          goodsId: null,
          name: '',
          // category: 2,
          // stock: '',
          waterNum: null,
          price: null,
          imgurl: '',
          saleStatus: 1,
          // label: '',
          waterNote: '',
          note: ''
        },
        tags: ['标签一'],
        myEditor: null,
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
      // VueEditor,
      goodsSearch,
      ImgUploader,
      'tags-input': require('vue-tagsinput/src/input.vue')
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // vm.params.sellerId = vm.$store.state.global.sellerId
      vm.getTicket()
    },
    /*computed: {},*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'edit_goods') {
          vm.getTicket()
        }
      }
    },
    methods: {
      chooseGoods() {
        vm.showGoodsList = true
      },
      getGoodsData(data) {
        vm.showGoodsList = false
        vm.selGoodsName = data.name || ''
        vm.params.goodsId = data.id || null
      },
      getImgUrl(data) {
        if (me.isArray(data) && data.length) {
          vm.params.imgurl = data.join(',')
        } else {
          vm.params.imgurl = ''
        }
      },
      initEditor(){
        vm.myEditor = new Simditor({
          textarea: $('#editor'),
          placeholder: '我是示例文字…',
          defaultImage: 'images/image.png/,image.jpg',
          params: {},
          upload: {
            url: commonApi.uploadImg,
            params: null,
            fileKey: 'image',
            connectionCount: 1,
            leaveConfirm: ''
          },
          tabIndent: true,
          toolbar: true,
          toolbarFloat: true,
          toolbarFloatOffset: 0,
          toolbarHidden: false,
          pasteImage: false,
          cleanPaste: false,

        })
        /*vm.myEditor.on( 'valuechanged', function(e, src){
         console.log(vm.myEditor.getValue())
         })*/
        vm.myEditor.on('blur', function (e, src) {
          vm.params.note = vm.myEditor.getValue()
        })
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
      getTicket() {
//        vm.initEditor()
        vm.lineData = vm.$route.query.linedata ? JSON.parse(decodeURIComponent(vm.$route.query.linedata)) : ''
        // console.log(vm.lineData)
        if (vm.lineData && vm.lineData.id) {
          vm.params = {
            id: vm.lineData.id,
            brandId: vm.lineData.brandId,
            goodsId: vm.lineData.goodsId,
            name: vm.lineData.name,
            ticketType: vm.lineData.type,
            // category: vm.lineData.category,
            // stock: vm.lineData.stock,
            waterNum: vm.lineData.waterNum,
            price: vm.lineData.price,
            imgurl: vm.lineData.imgurl,
            saleStatus: vm.lineData.saleStatus,
            waterNote: null,
            note: vm.lineData.note
          }
          // vm.switchData(vm.brands, vm.lineData.brandId, 'tmpBrand', 1)
          vm.switchData(vm.types, vm.lineData.ticketType, 'tmpType', 1)
          vm.switchData(vm.types, vm.tmpType, 'ticketType')
          // vm.switchData(vm.categories, vm.lineData.category, 'tmpCat', 1)
          // vm.renderTags(vm.lineData.label)
//          vm.myEditor.setValue(vm.lineData.note)
        } else {
          vm.params = {
            ticketType: 1,
            goodsId: null,
            name: '',
            // category: 2,
            // stock: '',
            waterNum: null,
            price: null,
            imgurl: '',
            saleStatus: 1,
            waterNote: '',
            note: ''
          }
          vm.tags = []
          vm.tmpBrand = []
          vm.tmpType = []
          vm.tmpCat = []
//          vm.myEditor.setValue('')
        }
        /*if (vm.isPosting) return false
         vm.isPosting = true
         vm.loadData(ticketApi.list, {id: vm.params.id}, 'POST', function (res) {
         if (res) {
         let resD = res.data.itemList
         /!*此处转换一些字段类型*!/
         // a.比如把type和goodsCategory转换成数组
         vm.switchData(vm.types, vm.params.ticketType, 'tmpType')
         vm.switchData(vm.categories, vm.params.category, 'tmpCat')
         vm.renderTags(resD.label)
         vm.goods = resD
         console.log(vm.goods)
         }
         vm.isPosting = false
         }, function () {
         vm.isPosting = false
         })*/
      },
      validate() {
        if (vm.params.goodsId === '') {
          vm.toast('请选择关联商品！', 'warn')
          return false
        }
        if (!vm.params.name) {
          vm.toast('请填写水票名名称！', 'warn')
          return false
        }
        if (!vm.params.price) {
          vm.toast('请选择水票价格！', 'warn')
          return false
        }
        if (!vm.params.waterNum) {
          vm.toast('请选择水票容量！', 'warn')
          return false
        }
        /*if (!vm.params.stock) {
         vm.toast('请输入库存！', 'warn')
         return false
         }*/
        if (!vm.params.ticketType) {
          vm.toast('请选择水票类型！', 'warn')
          return false
        }
        if (!vm.params.imgurl) {
          vm.toast('请上传水票图片！', 'warn')
          return false
        }
        /*if (!vm.params.note) {
         vm.toast('请填写详情！', 'warn')
         return false
         }*/
        return true
      },
      updateTicket() {
        if (vm.isPosting || !vm.validate()) return false
        /*此处转换一些字段类型*/
        let curApi
        vm.formatNewTag()
        if (vm.lineData.id) {
          curApi = ticketApi.update
        } else {
          curApi = ticketApi.add
        }
        console.log('最后选择的数据：', vm.params)
        vm.isPosting = true
        vm.processing()
        vm.loadData(curApi, vm.params, 'POST', function (res) {
          vm.processing(0, 1)
          vm.toast(vm.lineData.id ? '已更新' : '已添加')
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
        vm.switchData(vm.types, vm.tmpType, 'ticketType')
        console.log(val, vm.params.ticketType)
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
          this.tags.splice(index, 0, text)
        } else {
          this.tags.splice(index, 1)
        }
      },
      changeTextArea(){
        vm.params.note = vm.myEditor.getValue()
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
          })
          .then(function (result) {
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
    height: 100%;
    padding-bottom: 50px;
    .wrap-con {
      height: 100%;
    }
    .bottom {
      margin-top: 10/@rem;
    }
    #quill-container {
      height: 350px;
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
        padding: 24/@rem 10/@rem 140/@rem;
        .fz(26);
        .bor-t;
        label {
          .block;
          width: 100%;
          padding-bottom: 18/@rem;
        }
        .simditor-placeholder {
          padding: 20/@rem !important;
        }
        .simditor-body {
          padding: 20/@rem;
          -webkit-user-select: text;
          user-select: text;
          img {
            .block;
            max-width: 100% !important;
            height: auto !important;
          }
        }

        .ql-editor {
          -webkit-user-select: text;
          user-select: text;
          img {
            max-width: 100%;
          }
          .ql-toolbar {
            padding: 8px 0;
          }
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
