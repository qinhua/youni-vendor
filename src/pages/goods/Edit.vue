<template>
  <div class="goods-edit-con">
    <group>
      <x-input title="商品名称：" placeholder="商品名称" required text-align="right" v-model="params.name"></x-input>
      <!--<selector placeholder="商品分类" v-model="params.goodsType" title="商品分类" name="goodsType" :options="types"-->
      <!--@on-change="changeType"></selector>-->
      <popup-picker title="商品分类" :data="types" :columns="1" v-model="tmpType" ref="picker3" @on-show=""
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
      <!--<x-textarea title="商品头图：" :max="20" placeholder="商品头图" @on-blur="" v-model="params.description"-->
      <!--show-clear></x-textarea>-->
      <div class="upload-group">
        <label>商品头图</label>
        <div class="uploader-con">
          <uploader :count="3" :maxlength="5" @weui-input-change="handleFileInputChange">
            <!-- Uploader的标题slot -->
            <span slot="title">图片上传</span>
            <!-- 需要预览时，增加UploaderFiles容器 -->
            <uploader-files slot="uploader-files">
              <uploader-file image-url="..."></uploader-file>
              <!-- 预览图片可以包含status -->
              <uploader-file image-url="..." has-status>
                <icon slot="status" name="warn"></icon>
              </uploader-file>
              <uploader-file image-url="..." has-status>
                <span slot="status">50%</span>
              </uploader-file>
            </uploader-files>
          </uploader>
        </div>
      </div>
      <x-input title="折扣价：" placeholder="折扣价" text-align="right" v-model="params.discountPrice"></x-input>
      <x-textarea title="折扣说明：" :max="20" placeholder="折扣说明" @on-blur="" v-model="params.discountNote"
                  show-clear></x-textarea>
    </group>
    <group class="bottom">
      <div class="tags-group">
        <label>商品标签</label>
        <div class="tags-cons">
          <tags-input :tags="tags" placeholder="商品标签" @focus="handleFocus" @blur="handleBlur"
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
    XSwitch,
    PopupPicker,
    XTextarea,
    XAddress,
    ChinaAddressV3Data
  } from 'vux'
  import axios from 'axios'
  import {VueEditor} from 'vue2-editor'
  import {Icon, Uploader, UploaderFiles, UploaderFile} from 'vue-weui'
  //  import weui from '../../../static/js/weui.min.js'
  import {goodsApi, fileApi} from '../../service/main.js'

  export default {
    name: 'goods-edit',
    data() {
      return {
        onFetching: false,
        isPosting: false,
        goodsId: null,
        addressData: ChinaAddressV3Data,
        types: [{key: 1, value: '饮料', name: '饮料'}, {key: 2, value: '食品', name: '食品'}],
        categories: [{key: 1, value: '水', name: '水'}, {key: 2, value: '奶制品', name: '奶制品'}],
        status: [{key: 1, value: '在售'}, {key: 2, value: '停售'}],
        params: {
          sellerId: null,
          name: '',
          goodsType: 1,
          category: 2,
          stock: '',
          price: null,
          imgurl: '',
          saleStatus: 1,
          label: '',
          discountPrice: null,
          discountNote: '',
          note: ''
        },
        tags: ['标签一'],
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
      Selector,
      XSwitch,
      PopupPicker,
      CheckerItem,
      XTextarea,
      XAddress,
      ChinaAddressV3Data,
      VueEditor,
      Icon,
      Uploader,
      UploaderFiles,
      UploaderFile,
      'tags-input': require('vue-tagsinput/src/input.vue'), /**
       * 已上传文件数量
       * 注意，Uploader并不会对真实文件数量进行控制，count仅用于显示
       */
      count: {
        type: Number,
        required: false,
        validator: function (value) {
          return value >= 0;
        }
      },
      /**
       * 显示的最大可上传数量
       * 注意，Uploader并不会对真实文件数量进行控制，maxlength仅用于显示
       */
      maxlength: {
        type: Number,
        required: false,
        validator: function (value) {
          return value > 0;
        }
      },

      /**
       * 是否包含input元素
       */
      hasInput: {
        type: Boolean,
        required: false,
        default: true
      }

    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      vm.params.sellerId = vm.$store.state.global.sellerId
      vm.goodsId = this.$route.query.id || ''
      vm.goodsId ? vm.getGoods() : null

      /* 图片自动上传 */

    },
    computed: {},
    methods: {
      handleFileInputChange() {
        console.log(arguments)
      },
      switchData(data, value, target,) {
        let tmp
        if (typeof value === 'number') {
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
        if (vm.onFetching) return false
        vm.onFetching = true
        vm.loadData(goodsApi.get, {sellerId: vm.params.sellerId, id: vm.goodsId}, 'POST', function (res) {
          if (res) {
            let resD = res.data.itemList
            /*此处转换一些字段类型*/
            // a.比如把goodsType和goodsCategory转换成数组
            vm.switchData(vm.types, vm.params.goodsType, 'tmpType')
            vm.switchData(vm.categories, vm.params.category, 'tmpCat')
            vm.renderTags(resD.label)
            vm.goods = resD
            console.log(vm.goods)
          }
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })
      },
      validate() {
        if (!vm.params.name) {
          vm.toast('请填写商品名！')
          return false
        }
        if (!vm.params.goodsType) {
          vm.toast('请选择商品分类！')
          return false
        }
        if (!vm.params.category) {
          vm.toast('请选择商品类目！')
          return false
        }
        if (!vm.params.stock) {
          vm.toast('请输入库存！')
          return false
        }
        if (!vm.params.price) {
          vm.toast('请指定价格！')
          return false
        }
        if (!vm.params.note) {
          vm.toast('请填写商品详情！')
          return false
        }
        return true
      },
      updateGoods() {
        if (vm.isPosting || !vm.validate()) return false
        /*此处转换一些字段类型*/
        // a.比如把goodsType和goodsCategory转换成对应的数值
        let curApi
        vm.switchData(vm.types, vm.tmpType, 'goodsType')
        vm.switchData(vm.categories, vm.tmpCat, 'goodsCategory')
        vm.formatNewTag()
        if (vm.goodsId) {
          curApi = goodsApi.update
          vm.params.id = vm.goodsId
        } else {
          curApi = goodsApi.add
        }
        console.log('最后选择的数据：', vm.params)
        vm.isPosting = true
        vm.processing()
        if (vm.goodsId) {

        } else {

        }
        vm.loadData(curApi, vm.params, 'POST', function (res) {
          vm.$router.back()
          vm.isPosting = false
          vm.processing(0, 1)
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
        // vm.area = names.join('')
      },
      changeType(val) {
        console.log(val, vm.params.goodsType)
      },
      changeStatus(value, disabled) {
        // console.log(value, disabled)
      },
      changeCategory(val) {
        console.log(val)
      },
      changeTags(index, text) {
        console.log(index, text)
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
        vm.loadData(fileApi.uploadImg, formData, 'POST', function (res) {
          vm.$router.back()
          vm.isPosting = false
          vm.processing(0, 1)
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
        axios({
          url: 'https://101.132.35.4/file/uploadImage',
          method: 'POST',
          data: formData
        })
          .then((result) => {
            let url = result.data.url // Get url from response
            Editor.insertEmbed(cursorLocation, 'image', url);
          })
          .catch((err) => {
            console.log(err);
          })
      },
      preFormat() {
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
        .flex;
        padding: 24/@rem 30/@rem;
        .fz(26);
        label {
          .block;
          width: 180/@rem;
          /* padding-bottom: 18/@rem;*/
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
