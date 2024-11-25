<template>
    <n-modal v-model:show="showModalModel as boolean" preset="dialog" title="搜索" :show-icon="false" size="huge"
        class="modal-dialog" :mask-closable=false
        style="min-width:80vh; position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <div class="dialog-container">
            <n-space vertical>
                <n-auto-complete :options="autoCompleteOptions" placeholder="输入关键字" clear-after-select size="large"
                    :on-select="handleSelect" :on-update:value="updateValue" />
            </n-space>
        </div>
    </n-modal>

</template>

<script lang="ts" setup>
import { getDocList } from '@/api/doc';
import { AutoCompleteGroupOption, AutoCompleteOption } from 'naive-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const showModalModel = defineModel('show')
const autoCompleteOptions = ref<Array<AutoCompleteOption | AutoCompleteGroupOption | string>>([])

function handleSelect(value: string | number) {
    router.push({ path: `/Editor/${value}` }).then(() => {
        showModalModel.value = false
    })
}

function updateValue(value: string | null) {
    if (!value || value.length <= 0) {
        return
    }
    getDocList(-1, -1, false, value).then((resp) => {
        const arr: Array<AutoCompleteOption> = new Array<AutoCompleteOption>(resp.list.length)
        resp.list.map((val) => {
            arr.push({
                value: val.id.toString(),
                label: val.title
            } as AutoCompleteOption)
        })
        autoCompleteOptions.value = arr
    })
}




</script>