<template>
    <div>
        <global-upload :showUpload.sync="showUpload"></global-upload>
    </div>
</template>

<script>
import GlobalUpload from '@/components/GlobalUpload'
export default {
    name: 'Home',
    components: { GlobalUpload },
    data() {
        return {
            showUpload: true
        }
    }
}
</script>

<style lang="scss" scoped></style>
