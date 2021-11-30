<template>
    <div id="app" v-if="showUpload" :style="{ height: appStatus === 1 ? '4rem' : '30vh' }">
        <div id="app-btn">
            <span
                v-bind:title="'最小化'"
                class="iconfont"
                @click="appStatus = 1"
                v-if="appStatus !== 1"
                >&#xe65d;</span
            >
            <span
                v-bind:title="'最小化'"
                class="iconfont"
                @click="appStatus = 2"
                v-if="appStatus !== 2"
                >&#xe62b;</span
            >
            <span v-bind:title="'关闭'" class="iconfont" @click="handleClose()">&#xe619;</span>
        </div>
        <div id="upload-title">上传任务</div>
        <div id="upload-result">{{ uploadResult }}</div>
        <!-- <el-table :data="chunkObjList" style="width: 100%" height="calc(100% - 4rem)">
      <el-table-column prop="pnNames" label="PN码" show-overflow-tooltip align="center" header-align="center" width="width"> </el-table-column>
      <el-table-column prop="modelNames" label="设备型号" show-overflow-tooltip align="center" header-align="center" width="width"> </el-table-column>
      <el-table-column prop="suit" label="产品系列" show-overflow-tooltip align="center" header-align="center" width="width"> </el-table-column>
      <el-table-column prop="status" label="状态" show-overflow-tooltip align="center" header-align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">{{ scope.row.percent.toFixed(2) + '%' }}</span>
          <span v-else>{{ scope.row.status | statusTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70">
        <template slot-scope="scope">
          <span v-bind:title="'开始'" class="iconfont" v-if="scope.row.status === 2" @click="handleClickBtn(scope.$index, 1)">&#xe68a;</span>
          <span v-bind:title="'暂停'" class="iconfont" v-if="[0, 1].indexOf(scope.row.status) !== -1" @click="handleClickBtn(scope.$index, 2)"
            >&#xe67b;</span
          >
          <span class="iconfont" v-if="scope.row.status === 3" style="cursor: default">&#xe60b;</span>
          <span v-bind:title="'重试'" class="iconfont" v-if="[-2, -1].indexOf(scope.row.status) !== -1" @click="handleClickBtn(scope.$index, 1)"
            >&#xe708;</span
          >
          <span v-bind:title="'取消'" class="iconfont" v-if="[0, 1, 2].indexOf(scope.row.status) !== -1" @click="handleClickBtn(scope.$index, -1)"
            >&#xe619;</span
          >
        </template>
      </el-table-column>
    </el-table> -->

        <!-- <el-upload ref="packUpload" :show-file-list="false" :on-change="handleChange" action="" :auto-upload="false">
      <el-button slot="trigger" type="primary">上传</el-button>
    </el-upload> -->

        <div id="upload-table">
            <div id="table-title">
                <div class="title-class">PN码</div>
                <div class="title-class">设备型号</div>
                <div class="title-class">产品系列</div>
                <div class="title-class">状态</div>
                <div class="title-class">操作</div>
            </div>
            <div id="table-content">
                <div v-for="(item, index) in chunkObjList" :key="item.uid" class="upload-out-div">
                    <div class="upload-in-div">
                        <el-tooltip
                            v-if="item.params.pnNames && item.params.pnNames.length > 7"
                            effect="dark"
                            :content="item.params.pnNames"
                            placement="top-start"
                        >
                            <span> {{ item.params.pnNames | ellipsis(7) }} </span>
                        </el-tooltip>
                        <div v-else>{{ item.params.pnNames }}</div>
                    </div>
                    <div class="upload-in-div">
                        <el-tooltip
                            v-if="item.params.modelNames && item.params.modelNames.length > 7"
                            effect="dark"
                            :content="item.params.modelNames"
                            placement="top-start"
                        >
                            <span> {{ item.params.modelNames | ellipsis(7) }} </span>
                        </el-tooltip>
                        <div v-else>{{ item.params.modelNames }}</div>
                    </div>
                    <div class="upload-in-div">
                        <el-tooltip
                            v-if="item.params.suit && item.params.suit.length > 7"
                            effect="dark"
                            :content="item.params.suit"
                            placement="top-start"
                        >
                            <span> {{ item.params.suit | ellipsis(7) }} </span>
                        </el-tooltip>
                        <div v-else>{{ item.params.suit }}</div>
                    </div>
                    <div class="upload-in-div">
                        <span v-if="item.status === 1">{{ item.percent.toFixed(2) + '%' }}</span>
                        <!-- <span v-if="item.status === 1">{{ item.percent.toFixed(2) + '% (' + speed + 'MB/s)' }}</span> -->
                        <span v-else>{{ item.status | statusTextFilter }}</span>
                    </div>
                    <div class="upload-in-div">
                        <span
                            v-bind:title="'开始'"
                            class="iconfont"
                            v-if="item.status === 2"
                            @click="handleClickBtn(index, 1)"
                            >&#xe68a;</span
                        >
                        <span
                            v-bind:title="'暂停'"
                            class="iconfont"
                            v-if="[0, 1].indexOf(item.status) !== -1"
                            @click="handleClickBtn(index, 2)"
                            >&#xe67b;</span
                        >
                        <span class="iconfont" v-if="item.status === 3">&#xe60b;</span>
                        <span
                            v-bind:title="'重试'"
                            class="iconfont"
                            v-if="[-2, -1].indexOf(item.status) !== -1"
                            @click="handleClickBtn(index, 1)"
                            >&#xe708;</span
                        >
                        <span
                            v-bind:title="'取消'"
                            class="iconfont"
                            v-if="[0, 1, 2].indexOf(item.status) !== -1"
                            @click="handleClickBtn(index, -1)"
                            >&#xe619;</span
                        >
                    </div>
                    <span class="progress-span" :style="progressStyle(item, index)"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SparkMD5 from 'spark-md5'
export default {
    name: 'GlobalUpload',
    filters: {
        statusTextFilter(val) {
            switch (val) {
                case -2:
                    return '上传失败'
                case -1:
                    return '已取消'
                case 0:
                    return '排队中'
                // case 1:
                //   return '上传中'
                case 2:
                    return '暂停'
                case 3:
                    return '上传成功'
                default:
                    return '上传失败'
            }
        }
    },
    props: {
        showUpload: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            chunkSize: 20971520, // 20M
            appStatus: 2, //  1-最小化    2-最大化
            uploading: false, // 当时是否正在上传
            uploadIndex: 0, // 当前正在上传的index
            chunkObjList: [],
            successNum: 0,
            failedFlag: false
        }
    },
    computed: {
        // vuex列表
        uploadList() {
            const uploadList = []
            uploadList.push(...this.$store.state.uploadList)
            return uploadList
        },
        // 上传结果
        uploadResult() {
            // 统计结果
            const allNum = this.chunkObjList.length
            let successNum = 0,
                pauseNum = 0,
                cancelNum = 0,
                failedNum = 0
            this.chunkObjList.forEach(item => {
                switch (item.status) {
                    case -2:
                        failedNum++
                        break

                    case -1:
                        cancelNum++
                        break

                    case 2:
                        pauseNum++
                        break

                    case 3:
                        successNum++
                        break

                    default:
                        break
                }
            })

            let result = ''
            if (this.uploading) {
                // 有任务时，若有在上传的，则显示“正在上传(1/2)”，分子为成功任务数+1，分母为当前表内任务总数
                result = `正在上传(${successNum + 1}/${allNum})`
            } else {
                // 能上传的任务都处理完成时，若有失败任务则显示“有n个任务上传失败。”若有暂停或取消任务时显示“有n个任务被暂停或取消 。”若上传均成功则显示“上传完成”，描述顺序即为显示优先级
                if (successNum === allNum) {
                    result = '上传完成'
                } else {
                    result =
                        (failedNum > 0 ? `有${failedNum}个任务上传失败` : '') +
                        (failedNum > 0 && pauseNum + cancelNum > 0 ? '，' : '') +
                        (pauseNum + cancelNum > 0
                            ? `有${pauseNum + cancelNum}个任务被暂停或取消`
                            : '')
                }
            }

            return result
        },
        // 当前是否有未完成的任务
        isFinish() {
            return !(
                this.uploading ||
                this.chunkObjList.findIndex(obj => {
                    return [0, 1, 2].indexOf(obj.status) !== -1
                }) !== -1
            )
        },
        // 进度条
        progressStyle() {
            return (item, index) => {
                return `width: ${
                    this.uploadIndex === index && this.uploading ? item.percent + '%' : 0
                };`
            }
        }
    },
    watch: {
        uploadList(newVal, oldVal) {
            // 获取新增的上传任务
            const oldUidList = oldVal.map(item => {
                return item.file.uid
            })
            const addList = newVal.filter(item => {
                return oldUidList.indexOf(item.file.uid) === -1
            })

            if (addList.length > 0) {
                // 限制任务数
                if (this.chunkObjList.length - this.successNum > 9) {
                    this.$confirm(
                        '上传任务数量上限为10个，请等待旧任务结束后再添加新任务',
                        '上传任务数量已达上限',
                        {
                            confirmButtonText: '确定',
                            showCancelButton: false,
                            type: 'warning'
                        }
                    ).then(() => {})
                    return
                }

                // 显示上传组件
                if (!this.showUpload) {
                    this.$emit('update:showUpload', true)
                }
                // 构造任务
                this.createTask(addList[0])
            }
        }
    },
    methods: {
        // 创建任务
        createTask(uploadObj) {
            console.log('uploadObj', uploadObj)
            // 处理参数
            const {
                // 文件
                file,
                // 业务参数
                params,
                // 其他参数
                replaceId
            } = uploadObj

            const chunkObj = {
                // 状态参数
                file,
                uid: file.uid,
                fileName: file.name,
                chunkNames: [], // 切片名称
                status: 0, // 上传状态
                percent: 0, // 上传百分比
                percentCount: 0, // 单片所占百分比
                curChunk: 0, // 当前切片数
                chunkListLength: Math.ceil(file.size / this.chunkSize), // 总切片数
                suffix: /\.([0-9A-z]+)$/.exec(file.name)[0], // 文件后缀
                md5: new SparkMD5.ArrayBuffer(), // 根据文件内容生产md5
                // 业务参数
                params
            }

            console.log('replaceId', replaceId)
            // 判断替换或添加
            if (replaceId) {
                for (let i = 0; i < this.chunkObjList.length; i++) {
                    if (this.chunkObjList[i].uid === replaceId) {
                        this.$set(this.chunkObjList, i, chunkObj)
                        break
                    }
                }
            } else {
                this.chunkObjList.push(chunkObj)
            }

            // 统计各个状态的pn
            // this.statPn()

            // 调用上传
            this.sendRequest()
        },
        // 统计各个状态的pn
        statPn() {
            // 正在上传或等待上传的uid pns {pns, uid}
            const pnList = {}
            // 已取消或上传失败的uid pns {pns, uid}
            const failedPnList = {}
            this.chunkObjList.forEach(obj => {
                const pns = obj.params.pns || []
                // 正在上传或等待上传的
                if ([0, 1, 2].indexOf(obj.status) !== -1) {
                    pns.forEach(pn => {
                        pnList[pn] = obj.uid
                    })
                }
                // 已取消或上传失败的
                if ([-2, -1].indexOf(obj.status) !== -1) {
                    pns.forEach(pn => {
                        failedPnList[pn] = obj.uid
                    })
                }
            })
            this.$store.commit('updateUploadingPnList', pnList)
            this.$store.commit('updateFailedPnList', failedPnList)
        },
        // 任务点击
        handleClickBtn(index, val) {
            const chunkObj = this.chunkObjList[index]
            chunkObj.status = val

            // 统计各个状态的pn
            this.statPn()

            if (val === 1) {
                // 开始
                // 有任务则排队
                if (this.uploading) {
                    chunkObj.status = 0
                } else {
                    this.sendRequest()
                }
            } else {
                // 若是正在执行的任务就开始下一个任务
                if (index === this.uploadIndex) {
                    // // 清除定时器
                    // clearInterval(this.intervalId)

                    this.uploading = false
                    this.sendRequest()
                }
            }
        },
        // 发送请求
        sendRequest() {
            if (!this.uploading) {
                for (let i = 0; i < this.chunkObjList.length; i++) {
                    const chunkObj = this.chunkObjList[i],
                        file = chunkObj.file
                    // 开始第一个排队的
                    if ([0, 1].indexOf(chunkObj.status) !== -1) {
                        // 改状态
                        this.uploading = true
                        this.uploadIndex = i
                        chunkObj.status = 1

                        // 失败方法
                        const failed = () => {
                            chunkObj.status = -2
                            this.uploading = false

                            // 统计各个状态的pn
                            this.statPn()

                            this.sendRequest()
                        }

                        // 完成方法
                        const complete = () => {
                            console.log(123)
                            // 调用请求
                            const { params, fileName, chunkNames } = chunkObj
                            const { suit, modelAndPn, pns, otaVersion, comment } = params

                            console.log(4444)

                            this.$http({
                                url: this.$http.adornUrl('/api/v1/ota/complete'),
                                method: 'post',
                                data: this.$http.adornData({
                                    suit,
                                    modelAndPn,
                                    fileName,
                                    chunkNames
                                })
                            })
                                .then(res => {
                                    if (res.code === 0) {
                                        const data = res.data
                                        // 创建业务记录
                                        this.$http({
                                            url: this.$http.adornUrl('/api/v1/ota/save'),
                                            method: 'post',
                                            data: this.$http.adornData({
                                                productionIds: pns,
                                                otaVersion,
                                                comment,
                                                otaPath: data
                                            })
                                        })
                                            .then(res => {
                                                if (res.code === 0) {
                                                    // 统计成功
                                                    console.log('complete-success')
                                                    chunkObj.status = 3
                                                    this.successNum++
                                                    this.uploading = false

                                                    // 统计各个状态的pn
                                                    this.statPn()

                                                    this.sendRequest()
                                                } else {
                                                    console.log('save-failed')
                                                    failed()
                                                }
                                            })
                                            .catch(() => {
                                                console.log('save-failed')
                                                failed()
                                            })
                                    } else {
                                        console.log('complete-failed')
                                        failed()
                                    }
                                })
                                .catch(() => {
                                    console.log('complete-failed')
                                    failed()
                                })
                        }

                        // 边切分边上传
                        let chunk = undefined
                        const fread = new FileReader()
                        fread.onload = e => {
                            const ceilBuffer = e.target.result,
                                chunkName = `${chunkObj.uid}_${chunkObj.curChunk}${chunkObj.suffix}`

                            // 发送请求
                            const form = new FormData()
                            form.append('chunk', chunk)
                            form.append('fileName', chunkName)

                            this.$http({
                                url: this.$http.adornUrl(
                                    '/api/v1/ota/uploadFiles?t=' + new Date().getTime()
                                ),
                                method: 'post',
                                timeout: 1000 * 30,
                                data: form
                            })
                                .then(res => {
                                    console.log('res', res)
                                    if (res.code === 0) {
                                        if (chunkObj.percentCount === 0) {
                                            chunkObj.percentCount = 100 / chunkObj.chunkListLength
                                        }
                                        chunkObj.percent += chunkObj.percentCount
                                        chunkObj.md5.append(ceilBuffer)
                                        chunkObj.curChunk++
                                        chunkObj.chunkNames.push(chunkName)

                                        console.log('chunkObj', chunkObj)
                                        if (chunkObj.curChunk < chunkObj.chunkListLength) {
                                            uploadNext()
                                        } else {
                                            console.log('finish upload')
                                            chunkObj.md5.end()
                                            complete()
                                        }
                                    } else {
                                        console.log('send failed', chunkObj.curChunk + 1)
                                        failed()
                                    }
                                })
                                .catch(() => {
                                    console.log('send failed', chunkObj.curChunk + 1)
                                    failed()
                                })
                        }
                        fread.onerror = err => {
                            console.log('转换文件格式发生错误', err)
                            failed()
                        }

                        // 下一个
                        const uploadNext = () => {
                            if (chunkObj.status !== 1) return

                            const start = chunkObj.curChunk * this.chunkSize,
                                end =
                                    start + this.chunkSize >= file.size
                                        ? file.size
                                        : start + this.chunkSize
                            chunk = file.slice(start, end) // 用Blob.slice()切割
                            fread.readAsArrayBuffer(chunk)
                        }

                        console.log('start upload')
                        uploadNext()
                        console.log('上传了')
                    }

                    if (this.uploading) {
                        console.log('会到这么')
                        break
                    }
                }
            }
        },
        // 关闭
        handleClose() {
            const closeUplaod = () => {
                this.$emit('update:showUpload', false)
                this.appStatus = 2
                this.uploading = false
                this.uploadIndex = 0
                this.chunkObjList = []
                this.successNum = 0
            }
            if (!this.isFinish) {
                this.$confirm('列表中有未完成的上传任务，确定放弃上传吗?', '放弃上传', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        closeUplaod()
                    })
                    .catch(() => {})
            } else {
                closeUplaod()
            }
        },
        // 文件改变
        handleChange(file) {
            const uploadObj = {
                file: file.raw,
                fileName: file.name
            }
            console.log('uploadObj', uploadObj)

            this.$store.commit('addUpload', uploadObj)
        }
    }
}
</script>

<style lang="scss" scoped>
$lineHeight: 2rem;
.iconfont {
    cursor: pointer;
}
span + span {
    margin-left: 0.5rem;
}
#app {
    // 上传窗口
    overflow: hidden;
    font-size: 0.875rem;
    z-index: 999;
    background: #fff;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 25vw;
    border: 1px solid #bbbbbb;
    #app-btn {
        float: right;
        line-height: $lineHeight;
    }
    #upload-title {
        height: $lineHeight;
        line-height: $lineHeight;
    }
    #upload-result {
        background: #8ca2aa;
        color: #fff;
        height: $lineHeight;
        line-height: $lineHeight;
    }
    #upload-table {
        height: calc(100% - 4rem);
        #table-title {
            height: 3rem;
            display: flex;
            align-items: center;
            overflow-y: scroll;
            border-bottom: 0.1px solid #dbdbdb;
            .title-class {
                width: 20%;
                text-align: center;
            }
        }
        #table-content {
            height: calc(100% - 3.1rem);
            overflow-y: scroll;
            overflow-x: auto;
            .upload-out-div {
                height: 3rem;
                display: flex;
                align-items: center;
                border-bottom: 0.1px solid #dbdbdb;
                position: relative;
                .upload-in-div {
                    width: 20%;
                    text-align: center;
                }
                .progress-span {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    z-index: -1;
                    background: #87daff;
                }
            }
        }
    }
}
</style>
