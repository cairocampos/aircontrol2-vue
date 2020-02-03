<template>
    <div class="scanner-devices">
        <div class="view-header d-flex justify-content-between px-2">
            <div class="view-title">Scanner</div>
            <button
                v-if="items.length > 0"
                class="btn-custom info"
                @click="items = []; preload = false"
            >Voltar</button>
        </div>

        <div class="scanner-content px-3 my-2">
            <template v-if="preload">
                <b-table striped responsive hover :items="items" :fields="fields"></b-table>
                <PreLoad v-if="preload == true && items.length === 0" />
            </template>
            <template v-else>
                <div class="methods d-flex align-items-center pb-3 my-3">
                    <input type="radio" id="broadcast" value="0" v-model="form.scanType" />
                    <label for="broadcast">
                        <i class="fas fa-search"></i> Broadcast
                    </label>

                    <input type="radio" id="iprange" value="1" v-model="form.scanType" />
                    <label for="iprange">
                        <i class="fas fa-arrows-alt-h"></i> IP Range
                    </label>

                    <input type="radio" id="tcpip" value="2" v-model="form.scanType" />
                    <label for="tcpip">
                        <i class="fas fa-arrows-alt-h"></i> TCP IP
                    </label>
                </div>

                <div class="scanner--options">
                    <p class="lead text-muted">Opções</p>

                    <form>
                        <div>
                            <input
                                type="checkbox"
                                name="resolve_topology"
                                id="resolve_topology"
                                v-model="form.options.resolve_topology"
                            />
                            <label class="label-custom" for="resolve_topology">Resolver Topologia</label>

                            <input
                                type="checkbox"
                                name="monitor_devices"
                                id="monitor_devices"
                                v-model="form.options.monitor_devices"
                            />
                            <label class="label-custom" for="monitor_devices">Monitorar Dispositivos</label>

                            <template v-if="form.scanType == 0">
                                <input
                                    type="checkbox"
                                    name="descend_gateways"
                                    id="descend_gateways"
                                    v-model="form.options.descend_gateways"
                                />
                                <label
                                    class="label-custom"
                                    for="descend_gateways"
                                >Gateways Descendentes</label>
                            </template>
                            <template v-if="form.scanType == 1 || form.scanType == 2">
                                <div class="additionals-title">SET IP RANGE</div>
                                <label
                                    class="label-default"
                                    for="ip_range"
                                    v-if="form.scanType == 1"
                                >
                                    IP Range
                                    <button
                                        class="btn-custom dark"
                                        v-b-popover.hover="
											'192.168.0.1/24, 192.168.1.0/255.255.255.0, 192.168.1.0-192.168.1.10, 192.168.10-100.*'
										"
                                        title="Exemplo"
                                    >
                                        <i class="fas fa-question"></i>
                                    </button>
                                </label>
                                <label
                                    class="label-default"
                                    for="ip_range"
                                    v-if="form.scanType == 2"
                                >
                                    IP Range
                                    <button
                                        class="btn-custom info"
                                        v-b-popover.hover="
											'Os dispositivos responderão apenas a consultas de redes locais (192.168.0.0/16, 172.16.0.0/12, 10.0.0.0/8 e 169.254.0.0/16)'
										"
                                        title="Dica"
                                    >
                                        <i class="fas fa-question"></i>
                                    </button>
                                </label>
                                <input
                                    type="text"
                                    name="ip_range"
                                    class="input-custom"
                                    v-model="form.ip_range"
                                />
                                <p class="tip_input" v-if="form.scanType == 1">
                                    Exemplo: 192.168.0.1/24,
                                    192.168.1.0/255.255.255.0,
                                    192.168.1.0-192.168.1.10, 192.168.10-100.*
                                </p>
                                <p class="tip_input" v-if="form.scanType == 2">
                                    Exemplo: 192.168.0.0/16, 172.16.0.0/12,
                                    10.0.0.0/8, 169.254.0.0/16
                                </p>
                            </template>

                            <div class="mt-3 d-flex">
                                <button class="btn btn-success mx-0">Agendar</button>
                                <button
                                    @click.prevent="runDiscovery"
                                    class="btn btn-primary ml-2"
                                >Iniciar Busca</button>
                            </div>
                        </div>
                    </form>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
/*{"name":"discovery","args":{"ip_range":null,"root_id":2,"options":{"resolve_topology":true,"monitor_devices":true,"descend_gateways":true,"branch_id":null},"scanType":0,"sessionId":932430677}}*/

/*{"name":"discovery","args":{"ip_range":"192.168.0.1/24, 192.168.1.0","root_id":null,"options":{"resolve_topology":true,"monitor_devices":true,"descend_gateways":true,"branch_id":null},"scanType":1,"sessionId":932430677}}*/

/*{"name":"discovery","args":{"ip_range":"192.168.0.1/24, 192.168.1.0","root_id":null,"options":{"resolve_topology":true,"monitor_devices":true,"descend_gateways":true,"branch_id":null},"scanType":2,"sessionId":932430677}}*/
import { api } from "@/services.js";
export default {
    name: "ScannerDevices",
    data() {
        return {
            preload: false,
            form: {
                scanType: 0,
                ip_range: null,
                options: {
                    resolve_topology: true,
                    monitor_devices: false,
                    descend_gateways: false,
                    branch_id: null
                }
            },
            fields: [
                { label: "Dispositivo", key: "hostname" },
                { label: "Produto", key: "product" },
                { label: "IP", key: "ipv4" },
                { label: "modo", key: "wireless_mode" },
                { label: "mac", key: "hwaddr" }
                //{ key: "firmware" }
            ],
            items: []
        };
    },
    methods: {
        runDiscovery() {
            this.preload = false;
            let obj = { name: "discovery", args: this.form };
            api.post("/tasks", JSON.stringify(obj)).then(response => {
                obj["id"] = response.data.id;
                this.$store.dispatch("updateTaskRunning", obj);
                this.$store.dispatch("getResultTask", response.data.id);
                this.preload = true;
                let count = 0;

                if (response.data.id) {
                    let timer = setInterval(() => {
                        count++;
                        api.get(`/tasks/${response.data.id}/details`).then(
                            res => {
                                if (
                                    res.data.completed_on != null ||
                                    count == 5
                                ) {
                                    clearInterval(timer);
                                    let arr = [];
                                    for (
                                        let i = 0;
                                        i < res.data.items.length;
                                        i++
                                    ) {
                                        arr.push(res.data.items[i]);
                                    }

                                    this.items = arr;
                                    api.get("/devices");
                                    api.get("/views");
                                }
                            }
                        );
                    }, 5000);
                }
            });
        }
    }
};
</script>

<style scoped>
.methods label {
    color: #191c21;
    height: 60px;
    width: 130px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    padding: 5px 10px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: 0 10px 0 0;
}

input[type="radio"]:checked + label {
    border: 1px solid #191970;
    color: #191970;
}

input[type="radio"] {
    display: none;
}

.methods {
    border-bottom: 2px solid rgba(0, 0, 0, 0.4);
}

.box {
    position: relative;
}

.box i {
    position: absolute;
    top: 5px;
    left: 50%;
    margin-left: -12px;
}

.scanner--options .label-custom {
    color: #191c21;
    font-size: 14px;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
}

.scanner--options .label-custom::before {
    content: "";
    display: inline-block;
    height: 15px;
    width: 15px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    margin-right: 10px;
    border-radius: 0.25rem;
}

.scanner--options input[type="checkbox"]:checked + .label-custom:before {
    font-family: "Font Awesome 5 Free";
    font-weight: 700;
    content: "\f00c";
    color: #f2f2f2;
    background: #007bff;
    border-color: #007bff;
    font-size: 8px;
    line-height: 13px;
    text-align: center;
}

.icon::before {
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
}

.scanner--options input[type="checkbox"] {
    display: none;
}

.additionals-title {
    font-size: 14px;
    margin: 10px 0;
    border-bottom: 2px solid rgba(0, 0, 0, 0.4);
}
.label-default {
    display: block;
    margin: 0;
    padding: 0;
    color: #191c21;
    font-size: 14px;
    font-weight: bold;
}

.input-custom {
    width: 100%;
    border-radius: 0;
    height: 25px;
    background: #eee;
    margin: 0;
    padding: 0 5px;
}

.tip_input {
    font-size: 11px;
    margin-top: -15px;
}
</style>
