<template>
    <v-dialog persistent v-model="visible" width="500">
        <v-card tile>
            <v-card-title class="headline popup-title aat-uppercase" primary-title>
                {{title}}
            </v-card-title>

            <v-card-text class="aat-message-container">
                {{message}}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn v-if="customText" class="aat-button" @click="$emit('custom-clicked')">
                    {{customText}}
                </v-btn>

                <v-btn class="aat-button" @click="$emit('ok-clicked')" autofocus>
                    {{okText}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Component as VueComponent, Prop, Watch } from "vue-property-decorator";

    @VueComponent({
    })
    export default class AlertPopup extends Vue {
        @Prop()
        visible: boolean;

        @Prop()
        message: string;

        @Prop()
        title: string;

        @Prop()
        okText: string;

        @Prop()
        customText: string;

        @Watch("visible", { deep: true })
        visibleWatchHandler() {
            if (this.visible) {
                this.$forceUpdate();
            }
        }
    }

</script>

<style scoped>
    .aat-message-container {
        padding: 30px 20px !important;
    }
</style>
