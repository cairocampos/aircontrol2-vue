<template>
    <ModalDefault title="Forneça as credenciais para autenticar">
        <template v-slot:modalClose>
            <button class="btn-custom btn-incolor btn-close" @click="close">&times;</button>
        </template>

        <template v-slot:modalBody>
            <b-table resposive striped :fields="fields" :items="items">
                <template v-slot:cell(authStatus)="data">
                    <b
                        :class="[data.item.authStatus == 'conectado' ? 'text-success' : 'text-danger']"
                    >{{data.item.authStatus}}</b>
                </template>
            </b-table>

            <!--Insert Credentials-->
            <form v-if="!authSuccess">
                <div id="form-col">
                    <div class="input-col">
                        <label for="username">Username</label>
                        <input type="text" name="username" id="username" v-model="form.username" />
                    </div>
                    <div class="input-col">
                        <label for="password">Senha</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            v-model="form.password"
                        />
                    </div>
                    <div class="input-col">
                        <label for="port">Porta</label>
                        <input type="number" name="port" id="port" v-model="form.port" />
                    </div>
                </div>
                <div class="input-btn">
                    <PreLoad v-if="preload" class="py-2" />
                    <button
                        v-else
                        class="btn-custom info py-2 px-5"
                        @click.prevent="connectDevice"
                    >Conectar</button>
                </div>

                <ErrorNotification :errors="errors" />
            </form>
            <!--  -->
        </template>
    </ModalDefault>
</template>

<script>
import ModalDefault from "@/components/geral/ModalDefault.vue";
import { mapState, mapGetters, mapActions } from "vuex";
import { api } from "@/services.js";
import sendTask from "@/mixins/sendTasks.js";
export default {
    name: "ProvideAuth",
    props: ["deviceId"],
    mixins: [sendTask],
    components: {
        ModalDefault
    },
    data() {
        return {
            errors: [],
            fields: [
                { label: "Dispositivo", key: "hostname" },
                { label: "IP", key: "ip" },
                { label: "mac", key: "mac" }
            ],
            items: [],
            form: {
                id: this.deviceId,
                username: "ubnt",
                password: "ubnt",
                port: "22"
            },
            preload: false,
            authSuccess: false
        };
    },
    computed: {
        ...mapState(["provideAuthDevice"]),
        ...mapGetters(["getDataDeviceById"])
    },
    methods: {
        ...mapActions(["updateProvideAuthDevice"]),
        getInfoDevice() {
            let data = this.getDataDeviceById(this.deviceId);
            let props = data.properties;
            props._rowVariant = null;
            props.authStatus = null;
            props.id = data.deviceId;
            this.items.push(props);
        },
        close() {
            this.updateProvideAuthDevice({ open: false, deviceId: null });
        },
        connectDevice() {
            this.preload = true;
            let obj = {
                name: "check_credentials",
                args: { credentials: [this.form] }
            };

            api.post("/tasks", JSON.stringify(obj)).then(response => {
                obj["id"] = response.data.id;
                let taskId = response.data.id;
                this.$store.dispatch("updateTaskRunning", obj);

                this.valid(taskId);
            });
        },
        async valid(taskId) {
            this.errors = [];

            let timer = setInterval(() => {
                api.get("/tasks?time=hour").then(response => {
                    let data = response.data.results;
                    let task = data.find(item => item.id == taskId);

                    if (task.completed_on != null) {
                        clearInterval(timer);
                        if (task.completion_summary.result != "success") {
                            this.errors.push("Falha na autenticação!");
                            this.items.find(item => {
                                if (item.deviceId == this.deviceId) {
                                    item.authStatus = "falha";
                                }
                            });
                        } else {
                            this.items.find(item => {
                                if (item.deviceId == this.deviceId) {
                                    item.authStatus = "conectado";
                                }
                            });

                            let args = { device_ids: [this.deviceId] };
                            this.sendTask("start_monitoring", args);

                            let res = {
                                title: "",
                                msg: "iniciando monitoramento...",
                                type: "info"
                            };

                            this.$store.dispatch("updateResponseRequest", res);
                            this.$emit("updateStatus", this.deviceId);
                            this.authSuccess = true;
                        }
                        this.fields.push({
                            label: "Status",
                            key: "authStatus"
                        });
                        this.preload = false;

                        this.$store.commit("REMOVE_TASK", taskId);
                    }
                });
            }, 2500);
        }
    },
    created() {
        this.getInfoDevice();
    }
};
</script>

<style scoped>
#form-col {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
}

.input-col {
    display: flex;
    flex-direction: column;
}

label {
    color: #191c21;
}

.input-btn {
    margin: 0 auto;
}
</style>