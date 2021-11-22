import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        uploadList: [] // 待上传列表
    },
    mutations: {
        // 增加上传
        addUpload(state, data) {
            state.uploadList.push(data)
        },
        // 修改上传
        updateUpload(state, data) {
            const uploadList = state.uploadList
            for (let i = 0; i < uploadList.length; i++) {
                if (uploadList[i].uid === data.uid) {
                    uploadList[i] = data
                    break
                }
            }
        },
        // 删除上传
        deletUpload(state, data) {
            const uploadList = state.uploadList
            for (let i = uploadList.length - 1; i >= 0; i--) {
                if (uploadList[i].uid === data.uid) {
                    uploadList.splice(i, 1)
                    break
                }
            }
        }
    },
    actions: {},
    modules: {}
})
