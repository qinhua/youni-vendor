<template>
<div class="upload-group">
    <div class="weui-cells weui-cells_form" id="uploader-license">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <div class="weui-uploader">
            <div class="weui-uploader__hd"><p class="weui-uploader__title">{{title}}</p>
              <div class="weui-uploader__info" v-show="limit>1"><span id="uploadCount-license">1</span>/{{limit}}</div>
            </div>
            <div class="weui-uploader__bd">
              <ul class="weui-uploader__files" id="uploaderFiles-license"></ul>
              <div class="weui-uploader__input-box" v-show="showAdd"><input id="uploaderInput-license"
                                                                            class="weui-uploader__input"
                                                                            type="file" accept="image/*" multiple="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  let vm
  export default {
    name: 'img-uploader',
    data() {
      return {
        showAdd: true,
        imgArr: [] // 已上传的图片
      }
    },
    props: {
      title: {
        type: String,
        default: '图片上传'
      },
      api: {
        type: String,
        default: ''
      },
      limit: {
        type: Number,
        default: 1
      }
    },
    beforeMount() {
    },
    mounted() {
      vm = this
      vm.initImgPicker()
      /*vm.$nextTick(function () {})*/
    },
    /*watch: {},*/
    /*computed: {},*/
    methods: {
      reset() {
        vm.initImgPicker()
      },
      initImgPicker() {
        /* 图片自动上传 */
        var uploadCount = 0, limit = vm.limit, uploadList = []
        var uploadCountDom = document.getElementById("uploadCount-license")
        vm.weui.uploader('#uploader-license', {
          url: vm.api,
          auto: true,
          type: 'file',
          fileVal: 'image',
          compress: {
            width: 1600,
            height: 1600,
            quality: .8
          },
          onBeforeQueued: function (files) {
            if (["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0) {
              vm.weui.alert('请上传图片')
              return false
            }
            if (this.size > 10 * 1024 * 1024) {
              vm.weui.alert('请上传不超过10M的图片')
              return false
            }
            if (files.length > limit) { // 防止一下子选中过多文件
              vm.weui.alert('最多只能上传' + limit + '张图片，请重新选择')
              return false
            }
            if (files.length === limit) {
              vm.showAdd = false
            }
            if (uploadCount + 1 > limit) {
              vm.weui.alert('最多只能上传' + limit + '张图片')
              return false
            }
            ++uploadCount
            uploadCountDom.innerHTML = uploadCount
          },
          onQueued: function () {
            uploadList.push(this)
            // console.log(this)
          },
          onBeforeSend: function (data, headers) {
            // console.log(this, data, headers)
            // $.extend(data, { test: 1 }) // 可以扩展此对象来控制上传参数
            // $.extend(headers, { Origin: 'http://127.0.0.1' }) // 可以扩展此对象来控制上传头部
            // return false // 阻止文件上传
          },
          onProgress: function (procent) {
            // console.log(this, procent)
          },
          onSuccess: function (ret) {
            if (limit === 1) {
              vm.imgArr = []
            }
            vm.imgArr.push(window.youniMall.host + '/' + ret.imageUrl)
            vm.$emit('on-uploaded', {name: 'businessLicense', data: vm.imgArr})
          },
          onError: function (err) {
            console.log(this, err)
            vm.$emit('on-uploaded', {name: 'businessLicense', data: err})
          }
        })
        // 缩略图预览
        document.querySelector('#uploaderFiles-license').addEventListener('click', function (e) {
          var target = e.target
          while (!target.classList.contains('weui-uploader__file') && target) {
            target = target.parentNode
          }
          if (!target) return

          var url = target.getAttribute('style') || ''
          var id = target.getAttribute('data-id')
          if (url) {
            url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '')
          }
          var gallery = vm.weui.gallery(url, {
            className: 'custom-name',
            onDelete: function () {
              vm.weui.confirm('确定删除该图片？', function () {
                --uploadCount
                uploadCountDom.innerHTML = (uploadCount >= 0) ? uploadCount : 0
                for (var i = 0, len = uploadList.length; i < len; ++i) {
                  var file = uploadList[i]
                  if (file.id == id) {
                    file.stop()
                    vm.showAdd = true
                    vm.imgArr.splice(id - 1, 1)
                    // console.log(vm.imgArr)
                    vm.$emit('on-uploaded', {name: 'businessLicense', data: vm.imgArr})
                    break
                  }
                }
                target.remove()
                gallery.hide()
              })
            }
          })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .upload-group {
    .rel;
    padding: 0 30/@rem;
    .fz(26);
    #uploader-license {
      margin-top: 0;
      .weui-cell {
        padding: 10px 0;
      }
      &:after {
        .none;
      }
      #uploaderFiles-license {
        .weui-uploader__file {
          .rsize(60, 60);
        }
      }
      .weui-uploader__input-box {
        .rsize(60, 60);
      }
    }
  }
</style>
