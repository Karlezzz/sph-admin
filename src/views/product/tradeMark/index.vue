<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0;">添加</el-button>
    <el-table border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName">
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width:50px;height:50px">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[3,5,10]" :pager-count="7"
      layout="prev,pager,next,jumper,->,sizes,total" style="margin-top:20px;text-align:center;"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'tradeMark',
    data() {
      return {
        page: 1,
        limit: 3,
        total: 0,
        list: []
      }
    },
    mounted() {
      this.getPageList()
    },
    methods: {
      async getPageList() {
        let result = await this.$API.trademark.reqTradeMarkList(this.page, this.limit)
        if (result.code === 200) {
          this.total = result.data.total
          this.list = result.data.records
        }
      },
      handleCurrentChange(pager) {
        this.page = pager
        this.getPageList()
      }
    },
  }

</script>

<style>

</style>
