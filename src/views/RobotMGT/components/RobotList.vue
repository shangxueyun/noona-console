<template>
  <div>
    <el-dialog
      v-loading="RobotListloading"
      :title="Title"
      :visible="true"
      class="RobotList"
      width="40%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="clearClose"
    >
      <!--  -->
      <div>
        <el-table
          :data="goodsList"
          class="RobotListDataTable"
          border
          height="300px"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :label="$t('message.number')"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="mediaId"
            :label="$t('message.mediaId')"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="goodsName"
            :label="$t('message.goods')"
            :show-overflow-tooltip="true"
            header-align="center"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RobotListloading: false,
    }
  },
  props: {
    Title: {
      type: String,
      required: true,
      default: ''
    },
    goodsList: {
      type: Array,
      required: true,
      default: []
    }
  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    clearClose(row) {
      for (const i in this.from) { 
        this.from[i] = ''
      }
      this.$emit('handleClose')
    }
  }
}
</script>
