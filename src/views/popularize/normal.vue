<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-button
         style="margin-left: 20px;"
			   type="primary"
			   @click="addCode()"
			>
			   新增
			</el-button>
      <!-- <el-button
         style="margin-left: 20px;"
			   type="primary"
			   @click="goBack()"
			>
			   返回
			</el-button> -->
		</el-form>
    <el-table
      class="table"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="类型" align="center">
        <template slot-scope="{row}">
          <span>{{ formatterType(row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企微主体" align="center">
        <template slot-scope="{row}">
          <span>{{ formatterCompany(row.corp_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用人员" align="center">
        <template slot-scope="{row}">
          <span>{{ row.staff_list.toString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推广渠道" align="center">
        <template slot-scope="{row}">
          <span>{{ row.source_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告账号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码地址" align="center">
        <template slot-scope="{row}">
          <el-avatar shape="square" :size="100" :src="row.qr_code"></el-avatar>
          </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="delCode(row)">
            解绑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增联系我固定码" :visible.sync="dialogFormVisible" width="1100px">
      <el-table
        class="table"
        :key="tableKey"
        v-loading="digLoading"
        :data="digList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="{row}">
            <span>{{ formatterType(row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企微主体" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ formatterCompany(row.corp_id) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用人员" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.staff_list.toString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="推广渠道" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.source_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告账号" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.account_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="二维码地址" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-avatar shape="square" :size="100" :src="row.qr_code"></el-avatar>
            </template>
        </el-table-column>
        <el-table-column label="备注" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmAdd">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTypeCode, updateWecodeStatus, editWeight, typeCodeDel, wechatCodeList, typeCodeAdd, searchContactOfType, setTypeContact, deleteTypeContact } from '@/api/popularize'
import { deepClone } from "@/utils";
import Pagination from '@/components/Pagination'
const defaultQuery = {
  skip: 1,
  type_id: ''
}

const defaultDigQuery = {
  skip: 2,
  type_id: ''
}

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: JSON.parse(JSON.stringify(defaultQuery)),
      dialogFormVisible: false,
      editData: {},
      type: [],
      digLoading: false,
      digQuery: JSON.parse(JSON.stringify(defaultDigQuery)),
      digList: [],
      selectedNum: 0,
      selectedArr: []
    }
  },
  created() {
    this.listQuery.type_id = this.$route.query.id
    this.getList();
  },
  methods: {
    // 修改状态
    changeStatus (row) {
      let params = {
        id: row.id,
        data: row.status
      };
      updateWecodeStatus(params).then(response => {
        if (response.code == 1) {
          this.$message.success('修改成功')
          this.getList()
        }
      })
    },
    // 类型格式化
    formatterType (type) {
      if (type == 1) {
        return '单人'
      } else if (type == 2) {
        return '多人'
      } else {
        return '个人微信'
      }
    },
    // 确认添加
    confirmAdd() {
      if (this.selectedArr.length < 1) {
          this.$message.warning('请先勾选要新增的联系我固定码')
      } else {
          console.log(this.selectedArr)
          let ids = []
          this.selectedArr.forEach(item => {
            ids.push(item.id)
          })
          let params = {
            contact_list: ids.toString(),
            type_id: this.$route.query.id
          }
          setTypeContact(params).then(res => {
            if (res.code == 1) {
              this.dialogFormVisible = false;
              this.getList()
            }
          })
      }
    },
    // 返回
    goBack() {
      this.$router.push({
        path: '/popularize/popularize'
      })
    },
    // 重置
    handleReset () {
      this.digQuery = JSON.parse(JSON.stringify(defaultDigQuery))
      this.getCodeList()
    },
    // 选择新增
    handleSelectionChange(selectedData) {
      this.selectedNum = selectedData.length
      this.selectedArr = selectedData
    },
    // 格式化企微主体
    formatterCompany (id) {
      switch (id) {
        case 'ww84e21ddcde245da7':
          return '中广云投顾';
        case 'ww5fbafe202a1f7d80':
          return '中广云学堂';
        case 'ww1415629f5fbf0627':
          return '中广云智投';
        case 'ww473eb3c9a67a6830':
          return '中广云牛股营'
      }
    },
    // 新增固定二维码列表
    getCodeList () {
      this.digLoading = true;
      this.digQuery.type_id  = this.$route.query.id
      searchContactOfType(this.digQuery).then(res => {  
        if (res.code == 1) {
          this.digList = res.data;
        } else {
          this.$message.error(res.msg)
        }      
        this.digLoading = false;
      })
    },
    handleClick(item) {
      item.isDisabled = false;
      this.list = deepClone(this.list);
    },
    handleSure(row) {
      const param = {
        id: row.id,
        weight: row.weight
      };
      this.changeAssign(param);
    },
    changeAssign(data) {
      editWeight(data)
        .then((response) => {
          this.$message.success('修改成功');
          this.getList();
        })
        .catch((err) => {});
    },
    // 查询
    handleSearch() {
			this.getCodeList()
		},
    // 获取列表数据
    getList() {
      this.listLoading = true
      searchContactOfType(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data
          this.list.forEach((ele) => (ele.isDisabled = true));
        } else {
          this.$message.error(response.msg)
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 新增账号
    addCode () {
      this.dialogFormVisible = true;
      this.getCodeList()
    },
    // 编辑账号
    editInfo () {
      let params = {
        key: this.editData.key,
        info: this.editData.info,
        content: this.editData.content
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditConfig(params).then(response => {
        if (response.code == 1) {
          this.dialogFormVisible = false;
          this.getList()
          this.isEdit ? this.$message.success('编辑成功') : this.$message.success('新增成功')
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    delCode (row) {
      let params = {
        contact_id: row.id,
        type_id: this.$route.query.id
      }
      deleteTypeContact(params).then(res => {
         if (res.code == 1) {
           this.$message.success('删除成功');
           this.getList()
         }
      })
    },
    handleUpdate(row) {
      this.isEdit = true;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(row));
    }
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
</style>
