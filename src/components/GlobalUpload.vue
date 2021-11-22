<template>
    <div id="app" v-if="showUpload" :style="{ height: appStatus === 1 ? '4.5vh' : '30vh' }">
        <div class="appBtn">
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
        <el-upload
            ref="packUpload"
            :show-file-list="false"
            :on-change="handleChange"
            action=""
            :auto-upload="false"
        >
            <el-button slot="trigger" type="primary">上传</el-button>
        </el-upload>
        <!-- 进度显示 -->
        <div v-for="(item, index) in chunkObjList" :key="item.uid" class="progress-box">
            <span>上传进度：{{ item.percent.toFixed() }}%</span>
            <span>{{ item.status | btnTextFilter }}</span>
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
    </div>
</template>

<script>
import SparkMD5 from 'spark-md5'
export default {
    name: 'GlobalUpload',
    filters: {
        btnTextFilter(val) {
            switch (val) {
                case -2:
                    return '上传失败'
                case -1:
                    return '已取消'
                case 0:
                    return '排队中'
                case 1:
                    return '上传中'
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
            appStatus: 2, //  1-最小化    2-最大化
            uploading: false, // 当时是否正在上传
            uploadIndex: 0, // 当前正在上传的index
            chunkObjList: []
        }
    },
    computed: {
        uploadList() {
            const uploadList = []
            uploadList.push(...this.$store.state.uploadList)
            return uploadList
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
                // 构造任务
                this.createTask(addList[0])
            }
        }
    },
    methods: {
        // 创建任务
        createTask(uploadObj) {
            const fileObj = uploadObj.file
            const fread = new FileReader()
            fread.readAsArrayBuffer(fileObj)
            fread.onload = e => {
                const buffer = e.target.result

                // 按固定大小2M切片
                const chunkSize = 2097152,
                    chunkList = [],
                    chunkListLength = Math.ceil(fileObj.size / chunkSize),
                    suffix = /\.([0-9A-z]+)$/.exec(fileObj.name)[0]

                // 根据文件内容生产md5
                const spark = new SparkMD5.ArrayBuffer()
                spark.append(buffer)
                const md5 = spark.end()

                // 生成切片
                let curChunk = 0 // 切片时的位置
                for (let i = 0; i < chunkListLength; i++) {
                    const item = {
                        // 用Blob.slice()切割
                        chunk: fileObj.slice(curChunk, curChunk + chunkSize),
                        fileName: `${md5}_${i}${suffix}`
                    }
                    curChunk += chunkSize
                    chunkList.push(item)
                }

                this.chunkObjList.push({
                    uid: fileObj.uid,
                    suit: uploadObj.suit,
                    modelAndPn: uploadObj.modelAndPn,
                    chunkList,
                    status: 0,
                    percent: 0,
                    percentCount: 0
                })

                // 调用上传
                this.sendRequest()
            }
            fread.onerror = () => {
                console.log('转换文件格式发生错误')
            }
        },
        // 任务点击
        handleClickBtn(index, val) {
            const chunkObj = this.chunkObjList[index]
            chunkObj.status = val
            if (val === 1) {
                // 开始 有任务则排队
                if (this.uploading) {
                    chunkObj.status = 0
                } else {
                    this.sendRequest()
                }
            } else {
                // 暂停 若是正在执行的任务就开始下一个任务
                if (index === this.uploadIndex) {
                    this.uploading = false
                    this.sendRequest()
                }
            }
        },
        // 发送请求
        sendRequest() {
            if (!this.uploading) {
                for (let i = 0; i < this.chunkObjList.length; i++) {
                    const chunkObj = this.chunkObjList[i]
                    // 开始第一个排队的
                    if ([0, 1].indexOf(chunkObj.status) !== -1) {
                        // 改状态
                        console.log('i', i)
                        this.uploading = true
                        this.uploadIndex = i
                        chunkObj.status = 1

                        const chunkList = chunkObj.chunkList
                        const requestList = []

                        for (let j = chunkList.length - 1; j >= 0; j--) {
                            const fn = () => {
                                const form = new FormData()
                                form.append('chunk', chunkList[j].chunk)
                                form.append('fileName', chunkList[j].fileName)
                                form.append('suit', chunkObj.suit)
                                form.append('modelAndPn', chunkObj.modelAndPn)
                                return new Promise(resolve => {
                                    setTimeout(() => {
                                        // 发送请求
                                        if (chunkObj.percentCount === 0) {
                                            chunkObj.percentCount = 100 / chunkList.length
                                            console.log(123)
                                        }
                                        chunkObj.percent += chunkObj.percentCount
                                        chunkList.splice(j, 1)
                                        resolve()
                                    }, 1000 * 3)
                                }).then(() => {
                                    console.log(456)
                                })
                            }
                            requestList.push(fn)
                        }

                        let requestCount = 0 // 记录发送请求数

                        // 完成方法
                        const complete = () => {
                            console.log('complete')
                            chunkObj.status = 3
                            this.uploading = false
                            this.sendRequest()
                        }

                        // 发送方法
                        const send = async () => {
                            if (chunkObj.status !== 1) return
                            if (requestCount >= requestList.length) {
                                complete()
                                return
                            }
                            await requestList[requestCount]()
                            requestCount++
                            send()
                        }

                        // 开始上传
                        send()
                    }

                    if (this.uploading) {
                        break
                    }
                }
            }
        },
        // 关闭
        handleClose() {
            if (
                this.uploading ||
                this.chunkObjList.findIndex(obj => {
                    return [0, 1, 2].indexOf(obj.status) !== -1
                }) !== -1
            ) {
                this.$confirm('列表中有未完成的上传任务，确定放弃上传吗?', '放弃上传', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$emit('update:showUpload', false)
                    })
                    .catch(() => {})
            } else {
                this.$emit('update:showUpload', false)
            }
        },
        // 文件改变
        handleChange(file) {
            this.currentFile = file.raw

            const uploadObj = {
                file: file.raw
            }

            this.$store.commit('addUpload', uploadObj)
        }
    }
}
</script>

<style lang="scss" scoped>
#app {
    // 上传窗口
    z-index: 999;
    background: #fff;
    position: absolute;
    right: 1vw;
    bottom: 1.08vh;
    width: 25vw;
    border: 2px solid #409eff;
}
.appBtn {
    float: right;
}
.progress-box {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 8px 10px;
    background-color: #ecf5ff;
    font-size: 14px;
    border-radius: 4px;
}
.iconfont {
    cursor: pointer;
}
</style>
