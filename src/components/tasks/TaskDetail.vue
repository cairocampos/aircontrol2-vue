<template>
    <ModalDefault title="Detalhes da Tarefa">
        <template v-slot:modalClose>
            <button class="btn-custom btn-close" @click="close">&times;</button>
        </template>
        <template v-slot:modalBody>
            <div class="body-detail">
                <b-table :items="items" :fields="fields"></b-table>
            </div>
        </template>
    </ModalDefault>
</template>

<script>
import ModalDefault from "@/components/geral/ModalDefault.vue";
import { mapGetters } from "vuex";
import { api } from "@/services.js";
export default {
    name: "TaskDetail",
    props: ["detailInfo"],
    components: { ModalDefault },
    data() {
        return {
            fields: [],
            items: []
        };
    },
    computed: {
        ...mapGetters(["getDeviceById"])
    },
    watch: {
        detailInfo(val) {
            if (val) {
                this.loadInfo();
            }
        }
    },
    methods: {
        loadInfo() {
            let obj = {};
            let arr = [];
            let info = this.detailInfo;

            if (info) {
                if (info.task == "discovery") {
                    api.get(`/tasks/${info.taskId}/details`).then(response => {
                        let data = response.data;
                        console.log(data);
                        if (data) {
                            let newDevices = data.items.filter(
                                item => item.code == "new"
                            );

                            let existDevices = data.items.filter(
                                item => item.code == "existing"
                            );

                            let newFields = [
                                {
                                    label: `Novos dispositivos (${newDevices.length})`,
                                    key: "newDeviceFound"
                                },
                                {
                                    label: `Dispositivos existentes encontrados (${existDevices.length})`,
                                    key: "existDeviceFound"
                                }
                            ];

                            let newArr = [];

                            if (newDevices.length) {
                                let novo = {};
                                for (let key in newDevices) {
                                    novo["newDeviceFound"] =
                                        newDevices[key].ipv4;

                                    newArr.push(novo);
                                }
                            }

                            if (existDevices.length) {
                                let novo = {};
                                for (let key in existDevices) {
                                    novo["existDeviceFound"] =
                                        existDevices[key].ipv4;
                                }
                                newArr.push(novo);
                            }

                            this.items = newArr;
                            this.fields = newFields;
                        }
                    });
                } else {
                    this.fields = [
                        { label: "Ação", key: "action" },
                        { label: "Dispositivo", key: "device" },
                        { label: "Status", key: "status" }
                    ];
                    let details = info.details;
                    for (let key in details) {
                        if (details[key].device_name) {
                            obj["device"] = details[key].device_name;
                        } else if (details[key].id) {
                            obj["device"] = this.getDeviceById(details[key].id);
                        } else {
                            obj["device"] = "-";
                        }

                        if (details[key].result == "failed") {
                            obj["status"] = details[key].error.message;
                        } else {
                            obj["status"] = details[key].result;
                        }

                        obj["_cellVariants"] = {
                            status: this.detailInfo._rowVariant
                        };

                        obj["action"] = info.task;

                        arr.push(obj);
                    }

                    this.items = arr;
                }
            }
        },
        close() {
            this.$emit("update:detail", false);
        }
    },
    created() {
        this.loadInfo();
    }
};
</script>

<style>
.btn-close {
    background: transparent;
    color: #191c21 !important;
    font-size: 24px;
    padding: 0;
    margin: 0;
    top: 0;
    position: absolute;
    right: 5px;
    z-index: 99;
}

.md-container {
    width: 800px !important;
}

.body-detail {
    border-top: 2px solid #191c21;
}
</style>
