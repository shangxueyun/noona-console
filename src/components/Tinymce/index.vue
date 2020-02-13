<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
    <div class="editor-custom-btn-container">
      <el-button size="small" type="primary" icon="el-icon-upload" @click="FiledialogVisible = true">Click upload</el-button>

      <el-dialog
        title="Picture and video upload"
        :visible.sync="FiledialogVisible"
        v-loading="FiledialogVisibleloading"
        width="40%"
        :before-close="() => {FiledialogVisible = false} ">
          <div style="height: 246px;width: 38%;margin: 0 auto;">
            <img-upload v-if="FiledialogVisible" :fileType="fileType" @imgUploadInfo="imageSuccessCBK" :listImgTextDis="listImgTextDis" :config="updateImgConfig"></img-upload>
          </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import ImgUpload from '@/components/ImgUpload'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { ImgUpload },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    // 装载toolbar配置项
    toolbar: {
      type: Array,
      required: false,
      default: () => ([])
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    // 装载option配置项
    option: {
      type: [Array, String],
      required: false,
      default: () => ([])
    },
    fileType: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      FiledialogVisible: false,
      FiledialogVisibleloading: false,
      listImgTextDis: false,
      // 多图片加
      imgNum: 0,
      updateImgConfig:{
        refs: 'updateImg',
        styleCss: {
          width: '27%',
          float: 'left'
        },
        styleCssIocn: {
          width: '200px',
          height: '200px',
          lineHeight: '200px'
        },
        spanStylecss: {
          width: '50%',
        },
        showFileList: false,
        autoUpload: true,
        imgSizeW: '',
        imgSizeH: ''
      },
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['en'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: this.option.length > 0 ? this.option : plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        // images_upload_handler(blobInfo, success, failure, progress) {
        //   progress(0);
        //   const token = _this.$store.getters.token;
        //   getToken(token).then(response => {
        //     const url = response.data.qiniu_url;
        //     const formData = new FormData();
        //     formData.append('token', response.data.qiniu_token);
        //     formData.append('key', response.data.qiniu_key);
        //     formData.append('file', blobInfo.blob(), url);
        //     upload(formData).then(() => {
        //       success(url);
        //       progress(100);
        //     })
        //   }).catch(err => {
        //     failure('出现未知问题，刷新页面，或者联系程序员')
        //     console.log(err);
        //   });
        // },
      })
    },
    // 父组件回调方法
    imgNumSize (row) {
      this.imgNum = row
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      if (value == '') {
        this.imgNum = 0
      }
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    formDataFor(obj, file) {
      const formData = new FormData()
      for (const i in obj) {
        formData.append(i, obj[i])
      }
      formData.append('file', file)
      return formData
    },
    // 上传oss并且插入
    imageSuccessCBK(file) {
      const _this = this
      debugger
      if (this.fileType == 'video') {
      } else if (this.fileType == 'image') {
        if (file.file.type.indexOf(this.fileType) == -1) {
          this.$message.error(this.$i18n.t('message.PleaseFileTypeimages'))
          this.FiledialogVisible = false
          return false
        }
      } else {
        this.$message.error(this.$i18n.t('message.PleaseFileType'))
        this.FiledialogVisible = false
        return false
      }
      _this.fileObjcentent = file
      this.FiledialogVisibleloading = true
      this.$http.httpRequestImgConfig(_this.fileObjcentent.type, _this.fileObjcentent.size.toString()).then(response => {
        if (response.response.status === 200 || response.status === 200) {
          // 修改参数
          _this.fileObjcentent.url = response.data.data.addressUrl
          this.$RequestHeader.AjaxPost(this.$http.AliUrl(''), this.formDataFor(response.data.data.body, _this.fileObjcentent.file), { headers: { 'Content-Type': '' }}).then(response => {
            if (response.response.status === 200 || response.status === 200) {
              this.FiledialogVisibleloading = false
              this.FiledialogVisible = false
              this.imgNum++
              let str
              let sort = JSON.stringify({SortId: this.imgNum})
              if (file.file.type.indexOf('video') >=0) {
                str = `<video controls="controls" class="VIDEO_${this.imgNum}" src="${_this.fileObjcentent.url}" ></video>`
              } else if (file.file.type.indexOf('image') >=0){
                str = `<img class="IMG_${this.imgNum}" src="${_this.fileObjcentent.url}" />`
              } else {
                str = ''
              }
              window.tinymce.get(_this.tinymceId).insertContent(str)
              _this.fileObjcentent.sortId = this.imgNum
              this.$emit('imgCallback', _this.fileObjcentent)
            } else {
              _this.dialogVisibleloading = false
              _this.$message.error(this.$i18n.t('message.requestFailed'))
            }
          })
        } else {
          _this.dialogVisibleloading = false
          _this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
