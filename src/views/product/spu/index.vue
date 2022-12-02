<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :isShowList="isShowList"></CategorySelect>
    </el-card>
    <el-card>
      <div v-if="(scene==0)">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="(scene=1)"
          :disabled="!category3Id">添加SPU
        </el-button>
        <el-table style="width: 100%" border :data="spuList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="240">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="580">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改" @click="updateSpu(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="详细"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[3,5,10]"
          layout="prev,pager,next,jumper,->,sizes,total" style="text-align:center"
          @handleCurrentChange="handleCurrentChange(pager)" @handleSizeChange="handleSizeChange(limit)">
        </el-pagination>
      </div>
      <SpuForm v-if="(scene==1)"></SpuForm>
      <SkuForm v-if="(scene==2)"></SkuForm>
    </el-card>
  </div>
</template> 

<script>
  import SpuForm from './spuForm/SpuForm.vue'
  import SkuForm from './skuForm/SkuForm.vue'
  export default {
    name: 'Spu',
    components: {
      SpuForm,
      SkuForm
    },
    data() {
      return {
        isShowList: true,
        category1Id: '',
        category2Id: '',
        category3Id: '',
        total: 1,
        page: 1,
        limit: 3,
        spuList: [],
        isShowList: true,
        scene: 1
      }
    },
    methods: {
      getCategoryId({
        categoryId,
        level
      }) {
        //区分三级分类相应的id，以及父组件进行存储
        if (level == 1) {
          this.category1Id = categoryId;
          this.category2Id = "";
          this.category3Id = "";
        } else if (level == 2) {
          this.category2Id = categoryId;
          this.category3Id = "";
        } else {
          //代表三级分类的id有了
          this.category3Id = categoryId;
          //发请求获取平台的属性数据
          this.getSpuList();
        }
      },
      async getSpuList() {
        let result = await this.$API.spu.reqSpuList(this.page, this.limit, this.category3Id)
        if (result.code == 200) {
          this.spuList = result.data.records
          this.total = result.data.total
        }
      },
      handleCurrentChange(pager) {
        this.page = pager
        this.getPageList()
      },
      handleSizeChange(limit) {
        this.limit = limit
        this.getPageList()
      },
      updateSpu(row){
        this.scene=1
      }
    }
  }

</script>

<style>

</style>
