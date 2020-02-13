<template>
  <div>
    <el-dialog
      v-loading="AddProductloading"
      :title="bouncedTitle"
      :visible="true"
      class="AddProduct"
      width="60%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="Parameclear"
    >
      <!--  -->
      <el-form ref="addData" :model="addData" status-icon :rules="rules" label-width="150px" class="demo-ruleForm">
        <!-- !snatchTreasureField?name:'' -->
        <!-- !snatchTreasureField == TRUE == 一元夺宝 -->
        <!-- {width:'30%',float:'left'} -->
        <el-form-item v-if="!snatchTreasureField" style="width:30%;float:left;" :label="this.$i18n.t('message.goodType')" prop="type" :rules="rules.type">
          <el-select @change="changeType(addData.type)" v-model="addData.type" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.goodType')">
            <el-option
              v-for="item in goodTypeOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :style="!snatchTreasureField?{width:'35%',float:'left'}:{width:'50%',float:'left'}" :label="this.$i18n.t('message.goodsTitle')" prop="title" :rules="rules.title">
          <el-input v-model="addData.title" :placeholder="this.$i18n.t('message.goodsTitleAlert')" />
        </el-form-item>

        <el-form-item :style="!snatchTreasureField?{width:'35%',float:'left'}:{width:'50%',float:'right'}" :label="this.$i18n.t('message.goodsName')" prop="name" :rules="rules.name">
          <el-input v-model="addData.name" :placeholder="this.$i18n.t('message.goodsTitleAlert')" />
        </el-form-item>
        <span style="display: block;clear: both;" />
        <el-form-item :label="!snatchTreasureField?this.$i18n.t('message.dollarDetails'):this.$i18n.t('message.couponsDetails')" prop="details" :rules="rules.details">
          <el-input v-model="addData.details" type="textarea" :placeholder="!snatchTreasureField?this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.dollarDetails'):this.$i18n.t('message.couponsDetails')" />
        </el-form-item>

        <el-form-item v-if="snatchTreasureField" style="width: 50%;float: left;" :label="this.$i18n.t('message.couponsPrice')" prop="price" :rules="rules.price">
          <el-input v-model="addData.price" :placeholder="this.$i18n.t('message.couponsPrice')" />
        </el-form-item>
        <!-- {width: '50%',float: 'right'} -->
        <el-form-item v-if="Field && descriptionFlg" :style="Field && descriptionFlg?{width: '50%',float: 'left'}:{width: '50%',float: 'right'}" :label="this.$i18n.t('message.discountDescription')" prop="description" :rules="rules.description">
          <el-input v-model="addData.description" :placeholder="this.$i18n.t('message.exampleSatisfy')" />
        </el-form-item>
        <!-- 分割线 -->
        <span v-if="$i18n.locale === 'en'" style="display: block;width: 95%;margin-left: 4%;height: 1px;background: #ccc;clear: both;" />
        <span v-else style="display: block;width: 93%;margin-left: 7%;height: 1px;background: #ccc;clear: both;" />
        <h3 v-if="$i18n.locale === 'en'" style="padding-left: 2%;">{{ this.$i18n.t('message.pictureRelated') }}</h3>
        <h3 v-else style="padding-left: 6%;">{{ this.$i18n.t('message.pictureRelated') }}</h3>
        <!-- 图片上传最大300k -->
        <!--  -->
        <el-form-item :label="this.$i18n.t('message.commoditylist')" prop="listImg" :rules="rules.listImg">
          <el-upload
            class="avatar-uploader"
            date-value="listImg"
            style="width: 27%;float: left;"
            action="#"
            :show-file-list="false"
            :auto-upload="true"
            :before-upload="listImgBeforeAvatarUpload"
          >
            <img v-if="listImg.imageUrl" :src="listImg.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="listImgText">
            <nav>
              <li>{{ this.$i18n.t('message.imagesSize') }}：163*130</li>
              <li>{{ this.$i18n.t('message.alreadyUpload') }}：<span style="color:#46a6ff">{{ listImg.imageName }}</span></li>
            </nav>
          </div>
        </el-form-item>
        <!--  -->
        <el-form-item :label="this.$i18n.t('message.orderThumbnail')" prop="thumbnail" :rules="rules.thumbnail">
          <el-upload
            ref="thumbnailBeforeAvatarUpload"
            class="avatar-uploader"
            date-value="thumbnail"
            style="width: 27%;float: left;"
            action="#"
            :show-file-list="false"
            :auto-upload="true"
            :before-upload="thumbnailBeforeAvatarUpload"
          >
            <img v-if="thumbnail.imageUrl" :src="thumbnail.imageUrl" class="thumbnail">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="listImgText">
            <nav>
              <li>{{ this.$i18n.t('message.imagesSize') }}：100*100</li>
              <li>{{ this.$i18n.t('message.alreadyUpload') }}：<span style="color:#46a6ff">{{ thumbnail.imageName }}</span></li>
            </nav>
          </div>
        </el-form-item>
        <!--  -->
        <el-form-item :label="this.$i18n.t('message.orderDetailImg')" prop="DetailImgs" :rules="rules.DetailImgs">
          <el-upload
            class="avatar-uploader"
            date-value="orderDetailData"
            action="#"
            :show-file-list="true"
            :auto-upload="false"
            :file-list="orderDetailImgs"
            list-type="picture"
            :on-change="handlePreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus avatar-orderDetailImgs-icon" />
            <div slot="tip" style="line-height: 10px;">{{ this.$i18n.t('message.imagesSize') }}：375*170</div>
          </el-upload>
        </el-form-item>
        <!-- <input type="file" @change="thumbnailBeforeAvatarUpload" name="" id=""> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Parameclear">{{ this.$i18n.t('message.cancel') }}</el-button>
        <el-button type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (value !== '') {
        if (isNaN(Number(value))) {
          callback(new Error(this.$i18n.t('message.PleaseNumber')))
        } else {
          if (Number(value) > 0) {
            const index = value.toString().indexOf('.')
            if (index != -1) {
              if (value.toString().substr(value.toString().indexOf('.') + 1).length > 2) {
                callback(new Error(this.$i18n.t('message.couponsPrice') + this.$i18n.t('message.decimaldigits')))
              } else {
                callback()
              }
            } else {
              if (value.length > 9) {
                callback(new Error(this.$i18n.t('message.Exceedinglimit')))
              } else {
                callback()
              }
            }
          } else {
            callback(new Error(this.$i18n.t('message.couponsPrice') + this.$i18n.t('message.inventoryQuantity')))
          }
        }
      } else { callback(new Error(this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.couponsPrice'))) }
    }
    return {
      bouncedTitle: '',
      AddProductloading: false,
      modification: false,
      mediaId: null,
      // 一元夺宝参数
      snatchTreasureField: true,
      Field: true,
      descriptionFlg: true,
      // 7卡券； 8话费； 9实物
      goodTypeOptions: [
        { id: 7, label: '卡券' },
        { id: 8, label: '话费' },
        { id: 9, label: '实物' }
      ],
      addData: {
        type: '',
        title: '',
        name: '',
        details: '',
        price: '',
        description: ''
      },
      rules: {
        title: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.goodsTitle'), trigger: 'blur' }],
        name: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.goodsName'), trigger: 'blur' }],
        details: [{ required: true, message: !this.snatchTreasureField ? this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.dollarDetails') : this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.couponsDetails'), trigger: 'blur' }],
        price: [{ required: true, validator: validatePrice, trigger: 'blur' }],
        description: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.discountDescription'), trigger: 'blur' }]
      },
      listImg: {
        imageUrl: '',
        imageName: ''
      },
      thumbnail: {
        imageUrl: '',
        imageName: ''
      },
      orderDetailImgs: [],
      orderDetailData: [

      ],
      // 图片status 0未启用 1请求重置中 2重置请求成功返回参数 3数据修改 4数据修改完成待提交
      ImgsListFlg: 0,
      sortId: 2,
      SortIdM: '',
      SortIdMFlg: 0,
      MaxortId: '',
      modificationSortId: [],
      flgNumber: 0
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    const href = window.location.href
    if (/\/oneDollar\//.test(href)) {
      this.snatchTreasureField = false
      this.Field = false
      this.descriptionFlg = false
      this.rules.type = [
        { required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.goodType'), trigger: 'blur' }
      ]
    }
  },
  mounted() {

  },
  methods: {
    init(obj) {
      this.bouncedTitle = obj.bouncedTitle
      if (obj.data) {
        this.modification = true
        const { sourceType, mediaId, title, summary, content, discountDescription, price } = obj.data
        this.addData = {
          type: Number(sourceType),
          title,
          mediaId,
          name: summary,
          details: content,
          price,
          description: discountDescription
        }
        //
        if (this.addData.type == 7) {
          this.descriptionFlg = true
          this.Field = true
        }
        this.mediaId = mediaId
        const coverList = this.ArrNeaten(obj.data.cover)
        coverList.forEach((v, i) => {
          if (v.sortId === '0') {
            this.listImg = v
            this.listImg.imageName = this.listImg.url.substr(this.listImg.url.lastIndexOf('/') + 1, this.listImg.url.length)
            this.listImg.imageUrl = this.listImg.url
          } else if (v.sortId === '1') {
            this.thumbnail = v
            this.thumbnail.imageName = this.thumbnail.url.substr(this.thumbnail.url.lastIndexOf('/') + 1, this.thumbnail.url.length)
            this.thumbnail.imageUrl = this.thumbnail.url
          } else if (Number(v.sortId) > 1) {
            v.name = v.url.substr(v.url.lastIndexOf('/') + 1, v.url.length)
            this.orderDetailImgs.push(v)
            this.orderDetailData.push(v)
          }
        })
        this.SortIdM = this.orderDetailData.length + 2
        let max
        this.orderDetailData.forEach((v, i) => {
          if (max) {
            if (Number(v.sortId) - max > 0) { max = Number(v.sortId) }
          } else {
            max = Number(v.sortId)
          }
        })
        this.MaxortId = max
      }
    },
    changeType(type) {
      if (type == 7) {
        this.descriptionFlg = true
        this.Field = true
      } else {
        this.descriptionFlg = false
        this.Field = false
      }
    },
    listImgBeforeAvatarUpload(file) {
      // 去除多余
      delete file.uid
      if (!/image/g.test(file.type)) {
        this.$message.error(this.$i18n.t('message.Uploadformat'))
      } else if (file.size > 307200) {
        this.$message.error(this.$i18n.t('message.Uploadsize'))
      } else {
        this.ImgDocument(file, 'listImg', file.size)
      }
      return false
    },
    thumbnailBeforeAvatarUpload(file) {
      // 去除多余
      delete file.uid
      if (!/image/g.test(file.type)) {
        this.$message.error(this.$i18n.t('message.Uploadformat'))
      } else if (file.size > 307200) {
        this.$message.error(this.$i18n.t('message.Uploadsize'))
      } else {
        this.ImgDocument(file, 'thumbnail', file.size)
      }
      return false
    },
    handleRemove(file, fileList) {
      const arr = this.orderDetailData
      let valueflg
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].uid === file.uid) {
          valueflg = i
          continue
        }
      }
      this.modificationSortId.push(Number(file.sortId))
      arr.splice(valueflg, 1)
      this.orderDetailData = arr
    },
    handlePreview(file, fileList) {
      const fileDoc = file.raw
      // 去除多余
      delete fileDoc.uid
      if (!/image/g.test(fileDoc.type)) {
        fileList.pop()
        this.$message.error(this.$i18n.t('message.Uploadformat'))
      } else if (fileDoc.size > 307200) {
        fileList.pop()
        this.$message.error(this.$i18n.t('message.Uploadsize'))
      } else {
        this.ImgDocument(fileDoc, 'orderDetailData', fileDoc.size, file.uid)
      }
      return true
    },
    // 图片信息获取
    ImgDocument(file, str, size, uid) {
      const reader = new FileReader()
      //
      window.FlgImgs = null
      window.FlgImgsFile = null
      window.$vue = this
      window.FlgImgs = str

      window.FlgImgsFile = {
        url: '',
        size: size,
        uid,
        type: file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length),
        width: '',
        height: '',
        file: file,
        imageName: file.name,
        imageUrl: URL.createObjectURL(file)
      }
      reader.onload = function(evt) {
        const img = new Image()
        img.src = evt.target.result
        img.onload = function(e) {
          window.FlgImgsFile.width = e.target.width
          window.FlgImgsFile.height = e.target.height
          if (window.FlgImgs === 'orderDetailData') { window.$vue[window.FlgImgs].push(window.FlgImgsFile) } else { window.$vue[window.FlgImgs] = window.FlgImgsFile }
        }
      }
      reader.readAsDataURL(file)
    },
    responseUpdate(obj, file) {
      const vm = this
      this.$RequestHeader.AjaxPost(this.$http.AliUrl(''), this.formDataFor(obj, file), { headers: { 'Content-Type': '' }}).then(response => {
        if (response.response.status === 200 || response.status === 200) {
          if (vm.orderDetailData.length - 1 !== vm.flgNumber) {
            vm.flgNumber++
            vm.productionSubmit()
          } else { vm.productionSubmit(1) }
        } else {
          vm.AddProductloading = false
          vm.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    //
    ImgDocumentArr(arr) {
      const vm = this
      this.$RequestHeader.ResetPicture(vm.orderDetailData[vm.flgNumber].type).then(response => {
        // 修改参数
        if (response.response.status === 200 || response.status === 200) {
          let sortId
          if (vm.modification) {
            if (vm.modificationSortId.length == 0) {
              sortId = vm.SortIdM
              vm.SortIdM++
            } else {
              sortId = vm.modificationSortId[vm.SortIdMFlg]
              if (!sortId) {
                sortId = Number(vm.MaxortId) + 1
                vm.MaxortId = sortId
              }
              vm.SortIdMFlg++
            }
          } else {
            sortId = vm.sortId++
          }
          vm.orderDetailData[vm.flgNumber].sortId = sortId// 2为订单详情list图片
          vm.orderDetailData[vm.flgNumber].type = 1
          vm.orderDetailData[vm.flgNumber].url = response.data.data.addressUrl
          vm.responseUpdate(response.data.data.body, vm.orderDetailData[vm.flgNumber].file)
        } else {
          vm.AddProductloading = false
          vm.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    productionSubmit(flg) {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          window.FlgImgs = null
          window.FlgImgsFile = null
          window.$vue = null
          if (this.listImg.imageUrl === '') {
            this.$message.error(this.$i18n.t('message.commoditylist') + this.$i18n.t('message.imagesEmpty'))
          } else if (this.thumbnail.imageUrl === '') {
            this.$message.error(this.$i18n.t('message.orderThumbnail') + this.$i18n.t('message.imagesEmpty'))
          } else if (this.orderDetailData.length === 0) {
            this.$message.error(this.$i18n.t('message.orderDetailImg') + this.$i18n.t('message.imagesEmpty'))
          } else {
            if (flg === 1) {
              // 重置
              this.flgNumber = 0
              // 后续接口
              // 参数配置
              const params = {
                'basic': {
                  'mediaType': 8,
                  'userId': 10001,
                  'title': this.addData.title,
                  'summary': this.addData.name,
                  'content': this.addData.details,
                  'region': 'US',
                  'language': 'en',
                  'expireTime': 0,
                  'groupId': 0
                }
              }
              if (!this.snatchTreasureField) {
                params.basic.sourceType = this.addData.type
                if (this.descriptionFlg) {
                  params.basic.privateDetail = JSON.stringify({
                    'discountDescription': this.addData.description
                  })
                }
              } else {
                params.basic.sourceType = 6
                params.basic.privateDetail = JSON.stringify({
                  'discountDescription': this.addData.description,
                  'price': Number(this.addData.price) * 100
                })
              }
              if (this.mediaId) {
                params.mediaId = this.mediaId
                params.basic.mediaId = this.mediaId
              }
              if (!this.modification) {
                params.basic.sortId = 99
              }
              this.SubmitParams(params)
            } else {
              this.AddProductloading = true
              if (!this.orderDetailData[this.flgNumber].url) { this.ImgDocumentArr(this.orderDetailData[this.flgNumber]) } else {
                if (this.orderDetailData.length - 1 !== this.flgNumber) {
                  this.flgNumber++
                  this.productionSubmit()
                } else { this.productionSubmit(1) }
              }
            }
          }
        }
      })
    },
    SubmitParams(params) {
      const vm = this
      window.$vue = this
      this.AddProductloading = true
      if (!vm.listImg.url) {
        this.$RequestHeader.ResetPicture(vm.listImg.type).then(response => {
          if (response.response.status === 200 || response.status === 200) {
            // 修改参数
            vm.listImg.url = response.data.data.addressUrl
            vm.listImg.sortId = 0// 0为商品list
            vm.listImg.type = 1
            vm.$RequestHeader.AjaxPost(vm.$http.AliUrl(''), vm.formDataFor(response.data.data.body, vm.listImg.file), { headers: { 'Content-Type': '' }}).then(response => {
              if (response.response.status === 200 || response.status === 200) {
                vm.thumbnailFile(vm, window.$vue, params)
              } else {
                vm.AddProductloading = false
                vm.$message.error(this.$i18n.t('message.requestFailed'))
              }
            })
          } else {
            vm.AddProductloading = false
            vm.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      } else { vm.thumbnailFile(vm, window.$vue, params) }
    },
    thumbnailFile(vm, vueObj, params) {
      if (!vm.thumbnail.url) {
        vm.$RequestHeader.ResetPicture(vm.thumbnail.type).then(response => {
          if (response.response.status === 200 || response.status === 200) {
            // 修改参数
            vm.thumbnail.url = response.data.data.addressUrl
            vm.thumbnail.sortId = 1// 1为缩略图
            vm.thumbnail.type = 1
            vm.$RequestHeader.AjaxPost(vm.$http.AliUrl(''), vm.formDataFor(response.data.data.body, vm.thumbnail.file), { headers: { 'Content-Type': '' }}).then(response => {
              if (response.response.status === 200 || response.status === 200) {
                //
                vueObj.modifyParame(params)
              } else {
                vueObj.AddProductloading = false
                vueObj.$message.error(this.$i18n.t('message.requestFailed'))
              }
            })
          } else {
            vm.AddProductloading = false
            vm.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      } else { vueObj.modifyParame(params) }
    },
    formDataFor(obj, file) {
      const formData = new FormData()
      for (const i in obj) {
        formData.append(i, obj[i])
      }
      formData.append('file', file)
      return formData
    },
    modifyParame(params) {
      const obj = params; const vm = this; let url
      if (this.modification) {
        obj.covers = []
        obj.covers.push(
          this.ObjectSpell(this.listImg, this.modification),
          this.ObjectSpell(this.thumbnail, this.modification),
        )
        this.orderDetailData.forEach((v, i) => {
          obj.covers.push(this.ObjectSpell(v, this.modification))
        })
        url = '/service/media/v1/coupon/set'
      } else {
        obj.cover = []
        obj.cover.push(
          this.ObjectSpell(this.listImg, this.modification),
          this.ObjectSpell(this.thumbnail, this.modification),
        )
        this.orderDetailData.forEach((v, i) => {
          obj.cover.push(this.ObjectSpell(v, this.modification))
        })
        url = '/service/media/v1/add'
        // 创建已下架
        obj.basic.checkStatus = 1
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData(obj)
      }).then(data => {
        if (data.status === 200) {
          vm.Parameclear()
          vm.$message({
            type: 'success',
            message: this.$i18n.t('message.successfulOperation')
          })
          vm.AddProductloading = false
        } else {
          vm.AddProductloading = false
          vm.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    // 清空重置
    Parameclear() {
      window.$vue = null
      window.FlgImgs = null
      window.FlgImgsFile = null
      for (const i in this.addData) {
        this.addData[i] = ''
      }
      this.listImg = {
        imageUrl: '',
        imageName: ''
      }
      this.thumbnail = {
        imageUrl: '',
        imageName: ''
      }
      this.orderDetailImgs = []
      this.$emit('addProductVisible')
    },
    ArrNeaten(arr) {
      const Newarr = []
      arr.forEach((v, i) => {
        Newarr.push(v.coverObj['1'])
      })
      return Newarr
    },
    ObjectSpell(obj, flg) {
      let Newobj
      if (flg) {
        Newobj = {
          mediaId: this.mediaId ? this.mediaId : '',
          sortId: obj.sortId.toString(),
          height: obj.height,
          width: obj.width,
          size: obj.size,
          type: obj.type,
          url: obj.url
        }
      } else {
        Newobj = {
          sortId: obj.sortId.toString(),
          height: obj.height,
          width: obj.width,
          size: obj.size,
          type: obj.type,
          url: obj.url
        }
      }
      return Newobj
    }
  }
}
</script>

<style lang="scss" scoped>
.AddProduct{
  .listImgText{
    width: 54%;
    float: right;
    nav{
      li{
        list-style: none;
        line-height: 68px;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
<style>
  .AddProduct .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .AddProduct .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .AddProduct .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .AddProduct .avatar {
    width: 165px;
    height: 130px;
    display: block;
  }
  .AddProduct .thumbnail {
    width: 100px;
    height: 100px;
    display: block;
  }
  .AddProduct .avatar-orderDetailImgs-icon {
    font-size: 28px;
    color: #8c939d;
    width: 275px;
    height: 70px;
    line-height: 70px;
    text-align: center;
  }
  .AddProduct .el-upload-list--picture .el-upload-list__item{
    width: 32%;
    float: left;
    height: auto;
  }
  .AddProduct .el-upload-list--picture .el-upload-list__item-thumbnail{
    width: 162%;
  }
  .AddProduct .el-upload-list--picture .el-upload-list__item-name {
      display: block;
      margin-top: 8px;
      float: left;
      margin-left: -83px;
      width: 164%;
  }
  .AddProduct .el-upload-list__item .el-icon-close {
      top: 0px;
      right: 0px;
  }
</style>
