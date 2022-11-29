<template>
  <div>
    <el-card style="margin:20px 0;">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="isShowList=false" :disabled="category3Id?false:true">添加属性
        </el-button>
        <el-table border="" style="width: 100%;margin-top:10px" :data="attrInfoList">
          <el-table-column type="index" label="序号" width="70px" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="attrValueList" label="属性值列表" width="700">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="name in row.attrValueList" :key="name.id" style="margin-right:5px">
                {{name.valueName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="isShowList=false"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttrInfo(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
        <el-button @click="isShowList=true">取消</el-button>
        <el-table border style="width:100%;margin:20px 0">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Attr',
    data() {
      return {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        attrInfoList: [],
        isShowList: false
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
          this.getAttrInfoList();
        }
      },
      async getAttrInfoList() {
        let result = await this.$API.attr.reqAttrInfoList(this.category1Id, this.category2Id, this
          .category3Id)
        if (result.code == 200) {
          this.attrInfoList = result.data
        }
      },
      deleteAttrInfo(row) {
        this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let result = await this.$API.attr.reqDeleteAttrInfo(row.id)
          if (result.code == 200) {
            this.getAttrInfoList()
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      addOrUpdateAttrInfo() {
        this.isShowList = false
      }


    },
  }

</script>

<style>
</style>
