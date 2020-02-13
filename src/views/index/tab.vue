<template>
  <el-table :data="data" style="width: 100%" border>
    <el-table-column prop="date" :label="$t('message.date')" width="150" />
    <el-table-column :label="$t('message.accountName')" width="150">
      <template slot-scope="scope">
        <div v-for="(item,index) in scope.row.facebook" :key="index" class="d-border">
          {{ item.user_name }}
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('message.facebookNumber')" min-width="200">
      <template slot-scope="scope">
        <div v-for="(item,index) in scope.row.facebook" :key="index" class="d-border">
          {{ item.data.facebook }}
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('message.youtubeNumber')" min-width="200">
      <template slot-scope="scope">
        <div v-for="(item,index) in scope.row.youtube" :key="index" class="d-border">
          {{ item.data.youtube }}
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('message.insNumber')" min-width="200">
      <template slot-scope="scope">
        <div v-for="(item,index) in scope.row.instagram" :key="index" class="d-border">
          {{ item.data.instagram }}
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('message.tiktokNumber')" min-width="200">
      <template slot-scope="scope">
        <div v-for="(item,index) in scope.row.tiktok" :key="index" class="d-border">
          {{ item.data.tiktok }}
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('message.total')" min-width="180">
      <template slot-scope="scope">
        <div v-for="(item,index) in scope.row.youtube" :key="index" class="d-border">
          {{ item.data.total }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    data: [Array]
  }
}
</script>
<style>
    .d-border {
        line-height: 40px;
    }
</style>
