<template>
  <div>
    <el-card style="margin:20px 0;">
      <CategorySelect @getCategoryId="getCategoryId" :isShowList="isShowList"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="addAttr" :disabled="category3Id?false:true">添加属性
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
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttrInfo(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值
        </el-button>
        <el-button @click="isShowList=true">取消</el-button>
        <el-table border style="width:100%;margin:20px 0" :data="attrInfo.attrValueList">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" v-if="row.flag"
                @keyup.native.enter="row.flag=false" :ref="$index"></el-input>
              <span @click="toEdit(row,$index)" v-else style="display:block;height: 23px;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除  ${row.valueName}  吗？`"  @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
  import cloneDeep from "lodash/cloneDeep"
  export default {
    name: 'Attr',
    data() {
      return {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        attrInfoList: [],
        isShowList: true,
        attrInfo: {
          attrName: '',
          attrValueList: [],
          categoryId: 0,
          categoryLevel: 0,
          id: 0,
          flag: true,
        }
      }
    },
    methods: {
      addAttr() {
        this.isShowList = false
        this.attrInfo = {
          attrName: '',
          attrValueList: [],
          categoryId: this.category3Id,
          categoryLevel: 0,
          id: 0
        }
      },
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
      },
      addAttrValue() {
        this.attrInfo.attrValueList.push({
          flag: true,
          attrId: this.attrInfo.id,
          id: undefined,
          valueName: ''
        })
        this.$nextTick(() => {
          this.$refs[this.attrInfo.attrValueList.length - 1].focus()
        })
      },
      updateAttr(row) {
        this.isShowList = false
        this.attrInfo = cloneDeep(row)
        this.attrInfo.attrValueList.forEach(item => {
          this.$set(item, 'flag', false)
        });
      },
      toLook(row) {
        row.flag = false
        if (row.valueName.trim() == '') {
          this.$message("请勿输入空白值")
          this.attrInfo.attrValueList.pop()
        }
        let isRepeat = this.attrInfo.attrValueList.some(item => {
          if (row !== item) {
            return row.valueName == item.valueName
          }
        })
        if (isRepeat) {
          this.attrInfo.attrValueList.pop()
          this.$message("请勿输入重复值")
        }
      },
      toEdit(row, index) {
        row.flag = true
        this.$nextTick(() => {
          this.$refs[index].focus()
        })
      },
      deleteAttrValue(index){
        this.attrInfo.attrValueList.splice(index,1)
      },
      async addOrUpdateAttr(){
        
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
          delete item.flag
          return true
        })
        let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        if(result.code==200){
          this.$message({
            type:'success',
            message:'保存成功'
          })
          this.isShowList = false
          this.getAttrInfoList()
        }else{
          this.getAttrInfoList()
        }
      }
    },
  }

</script>

<style>
</style>
