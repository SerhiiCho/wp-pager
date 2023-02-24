import type { Module } from 'vuex'
import type FilesState from './FilesState'
import type RootState from '@admin/store/RootState'
import { ImageFile } from '@shared/types'
import { ServerResponse } from '@shared/types'
import axios from 'axios'

const files: Module<FilesState, RootState> = {
    namespaced: true,

    state: {
        files: [],
        loading: false,
    },

    getters: {
        files: (state): ImageFile[] => state.files,
        loading: (state): boolean => state.loading,
    },

    mutations: {
        FETCH_FILES(state): void {
            state.loading = true

            const url = `${pager.ajaxUrl}?action=pager_get_files`

            axios.get<ServerResponse<ImageFile[]>>(url)
                .then(resp => state.files = resp.data.data)
                .catch(e => console.error(e))
                .finally(() => state.loading = false)
        },

        DELETE_FILE(state, id: number): void {
            if (!confirm('Are you sure you want to delete this file?'))
                return

            state.loading = true

            const url = pager.ajaxUrl + '?action=pager_delete_file'

            const formData = new FormData()
            formData.set('id', id.toString())

            axios.post<ServerResponse<ImageFile[]>>(url, formData)
                .then(resp => state.files = resp.data.data)
                .catch(err => console.error(err))
                .finally(() => state.loading = false)
        },

        UPLOAD_ALL(state, files: File[]): void {
            if (!confirm('Are you sure you want to upload all files?'))
                return

            const url = pager.ajaxUrl + '?action=pager_upload_files'

            axios.post<ServerResponse<ImageFile[]>>(url)
                .then(resp => state.files = resp.data.data)
                .catch(err => console.error(err))
        },
    },

    actions: {
        fetchFiles({ commit }): void {
            commit('FETCH_FILES')
        },

        deleteFile({ commit }, id: number): void {
            commit('DELETE_FILE', id)
        },

        uploadAll({ commit }, files: File[]): void {
            commit('UPLOAD_ALL', files)
        },
    },
}

export default files