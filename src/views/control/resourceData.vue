<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="listQuery.createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="添加时间"
          end-placeholder="添加时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          @change="changeAddTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="直播间名">
          <el-select v-model="listQuery.cid" clearable multiple filterable>
            <el-option v-for="(item, index) in groupList"  :key="index" :label="item.account_name" :value="item.cid"></el-option>
          </el-select>
        </el-form-item>
			<el-button
         style="margin-left: 20px;"
			   type="primary"
			   icon="el-icon-search"
			   @click="handleSearch"
			>
			   搜索
			</el-button>
			<el-button type="danger" icon="el-icon-refresh" @click="handleReset"
				>重置</el-button
			>
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-document"
        @click="exportExcel"
        :loading="downloadLoading"
        >导出
      </el-button>
		</el-form>

    <el-table
      class="table"
      :key="tableKey"
      v-loading="listLoading"
      max-height="800px"
      :data="list"
      :summary-method="getSummaries"
      show-summary
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="平台" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="直播间名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源数" align="center" prop="all" sortable></el-table-column>
      <el-table-column label="非重复率" align="center" sortable prop="repeat_percentage"></el-table-column>
      <el-table-column label="回复率" align="center" sortable prop="reply_percentage"></el-table-column>
      <el-table-column label="删除率" align="center" sortable prop="delete_percentage"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { resourceCensus,clientList } from '@/api/other'
import { deepClone } from "@/utils";

const date = new Date()
const year = date.getFullYear()
const month =
	date.getMonth() + 1 < 10
		? '0' + (date.getMonth() + 1).toString()
		: date.getMonth() + 1
const day = date.getDate()

const defaultQuery = {
  start_time: '',
  end_time: '',
  cid: '',
  createTime: [
  `${year}-${month}-${day} 00:00:00`,
  `${year}-${month}-${day} 23:59:59`
  ]
}

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: JSON.parse(JSON.stringify(defaultQuery)),
      dialogFormVisible: false,
      editData: {},
      addBtn: false,
      groupList: [],
      pagesize: [10, 20, 30, 50, 100, 200],
      downloadLoading: false,
    }
  },
  created() {
    this.getList()
    this.getClientList()
  },
  methods: {
    getClientList () {
      clientList().then(res => {
        if (res.code == 1) {
          this.groupList = res.data
        }
      })
    },
    getSummaries(param) {
      console.log(param)
      const { columns, data } = param;
      const sums = [];
      var all = 0;
      var repeat = 0;
      var reply = 0;
      var delet = 0;
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }      
      });
      if (Array.isArray(data)) {
          data.forEach((item, index) => {
            all += item.all;
            repeat += item.repeat_num;
            reply += item.reply_num;
            delet += item.delete_num
          })
          console.log(all)
          sums[2] = all;
          sums[3] = ((repeat/all)*100).toFixed(2) + '%';
          sums[4] = ((reply/all)*100).toFixed(2) + '%';
          sums[5] = ((delet/all)*100).toFixed(2) + '%';
        }

      return sums;
    },
    // 查询
    handleSearch() {
			this.listQuery.page = 1
			this.getList()
		},
    // 重置
    handleReset() {
      this.listQuery = JSON.parse(JSON.stringify(defaultQuery))
      this.getList()
    },
    // 监听添加时间改变
    changeAddTime (value) {
      if (value[1].slice(value[1].length - 8, value[1].length) == '00:00:00') {
        var newDate = value[1].slice(0, value[1].length - 8);
        this.listQuery.createTime[1] = newDate + '23:59:59'
      }
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      if (this.listQuery.createTime != '' && this.listQuery.createTime != null) {
        this.listQuery.start_time = this.listQuery.createTime[0];
        this.listQuery.end_time = this.listQuery.createTime[1]
      } else {
        this.listQuery.start_time = '';
        this.listQuery.end_time = '';
      }
      let params = {
        start_time: this.listQuery.start_time,
        end_time: this.listQuery.end_time,
        cid: this.listQuery.cid.toString()
      }
      resourceCensus(params).then(response => {
        if (response.code == 1) {
          this.list = response.data
        } 
        this.listLoading = false    
      })
    },
    exportExcel() {
      let _this = this;
      if (this.list.length == 0) {
        this.$message.error("无数据要导出");
        return false;
      }
      if (this.list.length > 30000) {
				this.$message.error('数据量大于3W条,请分批导出')
				return false
			}
      this.downloadLoading = true;
      this.$confirm(
        "共检测到 " + this.list.length + " 条数据，确认要导出？",
        "下载确认框",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "danger",
        }
      )
        .then(async () => {
          const params  = {
            start_time: this.listQuery.start_time,
            end_time: this.listQuery.end_time,
            cid: this.listQuery.cid.toString()
          };
          let maxPage = parseInt(this.list.length / 1000 + 1);
          let lists_pro = [];
          for (let i = 1; i <= maxPage; i++) {
            let list = new Promise(function (resolve, reject) {
              resourceCensus(params).then(function (response) {
                if (response.code == 1) {
                  resolve(response.data);
                } else {
                  reject();
                }
              });
            });
            lists_pro.push(list);
          }
          Promise.all(this.list).then(function (val) {
            console.log(val)
            const filterVal = [
              "title",
              "account_name",
              "all",
              "repeat_percentage",
              "reply_percentage",
              "delete_percentage"
            ];
            let lists = [];
            let tmp = _this.formatJson(filterVal, val);
            for (let j = 0; j < tmp.length; j++) {
              lists.push(tmp[j]);
            }
            _this.downloadExcel(lists);
          });
        })
        .catch(() => {
          _this.downloadLoading = false;
          return false;
        });
    },
    formatJson(filterVal, jsonData) {
			return jsonData.map((v) =>
				filterVal.map((j) => {
					let vj = ''
					try {
						vj = v[j]
					} catch (err) {}
					return vj
				})
			)
		},
    downloadExcel(data = []) {
      let _this = this;
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        let tHeader = [
          "平台",
          "直播间名",
          "资源数",
          "非重复率",
          "回复率",
          "删除率"
        ];
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "资源明细统计表",
          autoWidth: _this.autoWidth,
          bookType: _this.bookType,
        });
        _this.downloadLoading = false;
      });
    },
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
</style>
