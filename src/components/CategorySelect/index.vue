<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" v-model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="!isShowList">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in category1List" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="!isShowList">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in category2List" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="!isShowList">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in category3List" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'CategorySelect',
    props:['isShowList'],
    data() {
      return {
        category1List: [],
        category2List: [],
        category3List: [],
        cForm: {
          category1Id: '',
          category2Id: '',
          category3Id: ''
        }
      }
    },
    mounted() {
      this.getCategory1List()

    },
    methods: {
      async getCategory1List() {
        let result = await this.$API.attr.reqCategory1List();
        if (result.code == 200) {
          this.category1List = result.data;
        }
      },
      async handler1() {
        this.category2List = [];
        this.category3List = [];
        this.cForm.category2Id = "";
        this.cForm.category3Id = "";
        const {
          category1Id
        } = this.cForm;
        this.$emit("getCategoryId", {
          categoryId: category1Id,
          level: 1
        });
        let result = await this.$API.attr.reqCategory2List(category1Id);
        if (result.code == 200) {
          this.category2List = result.data;
        }
      },
      async handler2() {
        this.category3List = [];
        this.cForm.category3Id = "";
        const {
          category2Id
        } = this.cForm;
        this.$emit("getCategoryId", {
          categoryId: category2Id,
          level: 2
        });
        let result = await this.$API.attr.reqCategory3List(category2Id);
        if (result.code == 200) {
          this.category3List = result.data;
        }
      },
      handler3() {
        const {
          category3Id
        } = this.cForm;
        this.$emit("getCategoryId", {
          categoryId: category3Id,
          level: 3
        });
      },
    },
  }

</script>

<style>

</style>
