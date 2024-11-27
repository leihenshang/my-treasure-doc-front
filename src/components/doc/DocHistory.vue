<template>
    <n-modal v-model:show="show as boolean" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <template #header>
            历史
        </template>
        <div class="dialog-container">
            配置项目
        </div>
        <template #action>
            <n-button type="primary" @click="handleOkBtn">恢复此版本</n-button>
            <n-button @click="show = false">取消</n-button>
        </template>
    </n-modal>
</template>
<script lang="ts" setup>

const show = defineModel('show')

function handleOkBtn() {

}
</script>