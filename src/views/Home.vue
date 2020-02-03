<template>
    <div class="home">
        <div class="view-header d-flex justify-content-between align-items-center px-2 mb-4">
            <div id="search" class="d-flex align-items-center">
                <button                
                    class="btn-custom btn-search my-0"
                    @click="showInput"
                    v-b-tooltip.hover
                    title="Pesquisar"
                >
                    <i class="fas fa-search"></i>
                </button>
                <input
                    :class="['inputFilter', { open: showSearch }]"
                    v-model="search"
                    type="search"
                    id="filterInput"
                    placeholder="Digite para buscar..."
                    ref="input"
                />
            </div>
            <div class="d-flex">
                <button class="btn"><i class="fas fa-columns" style="font-size: 1.5rem"></i></button> 
            
            <div v-if="devicesArray.length > 0" class="actions-tools">
                <b-dropdown class="dark" right no-caret variant="none">
                    <template v-slot:button-content>
                        <i class="fas fa-ellipsis-h text-dark" style="font-size: 1.5rem;"></i>
                    </template>
                    <b-dropdown-item href="#" @click="startMonitoring">
                        <span class="title">Iniciar Monitoramento</span>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="deleteDevices">
                        <span class="title">Remover</span>
                    </b-dropdown-item>
                </b-dropdown>
            </div>
            </div>
        </div>

        <b-table
            v-if="items.length > 0 && fields.length > 0"
            striped
            hover
            :items="items"
            :fields="fields"
            @row-clicked="showDevice"
            :filter="search"
            show-empty
        >
            <template v-slot:cell(select)="row">
                <b-form-checkbox @change="pushDevice(row.item.deviceId)"></b-form-checkbox>
            </template>
            <template v-slot:cell(status)="data">
                <div id="status" :class="[data.item.status.replace(' ', '_').toLowerCase()]"></div>
            </template>
            <template v-slot:cell(signal)="signal">
                <div class="signal">
                    <span class="level"></span>
                    <span class="level"></span>
                    <span class="level"></span>
                    <span class="level"></span>
                </div>
            </template>
            <template v-slot:emptyfiltered>Nenhum item encontrado</template>
        </b-table>

        <div v-else-if="items.length === 0 && fields.length === 0">
            <PreLoad class="preload-table" />
        </div>

        <div v-else-if="!items.length">
            <p class="not-found">Nenhum dispositivo a ser exibido!</p>
        </div>

        <!--Toggle Topology-->
        <div id="toggle-topology" @click="showSnack = !showSnack">
            <i class="fas fa-layer-group"></i>
        </div>

        <!--SnackBar -->
        <Devices :showSnack.sync="showSnack" />

        <!--Device Info-->
        <InfoDevice :device="device" :deviceFull.sync="deviceFull" @updateStatus="preload" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Devices from "@/components/device/Devices.vue";
import InfoDevice from "@/components/device/InfoDevice.vue";
import { getCookie } from "@/helpers.js";
import { api } from "@/services.js";
import sendTask from "@/mixins/sendTasks.js";
import confirmAction from "@/mixins/confirmAction.js";
import EventBus from "@/event-bus.js";

export default {
    name: "Home",
    mixins: [sendTask, confirmAction],
    components: {
        Devices,
        InfoDevice
    },
    data() {
        return {
            search: null,
            showSearch: false,
            showSnack: false,
            filters: [
                "status",
                "hostname",
                "ip",
                "fwVersion",
                "wlanOpModeString",
                "essid",
                "mac",
                "signal",
                "uptime"
            ],
            fields: [],
            items: [],
            device: null,
            deviceFull: false,
            devicesArray: []
        };
    },
    computed: {
        ...mapGetters(["getFormatByName"]),
        ...mapState(["updateDevices"])
    },
    watch: {
        updateDevices(value) {
            if (value === true) {
                this.loadTableInfo();
                this.$store.dispatch("updateDevices", false);
            }
        }
    },
    methods: {
        ...mapActions(["updateSessionUser"]),
        async loadConfig() {
            await this.updateSessionUser();
            let config = await this.$store.state.sessionUser.webProperties
                .devicesList;

            if (config) {
                let teste = config.all.filter(item => {
                    for (let i = 0; i < this.filters.length; i++) {
                        if (
                            (item.key.indexOf("DEVICES_LIST_TABLE_HEADER") ===
                                0 &&
                                item.visible == true) ||
                            item.hasOwnProperty("customKey")
                        ) {
                            return item;
                        }
                    }
                });

                let novo = [];
                for (let key in teste) {
                    novo.push(teste[key].name);
                }

                this.filters = novo;

                let headers = config.all.filter(item => {
                    for (let i = 0; i < this.filters.length; i++) {
                        if (
                            (item.key.indexOf("DEVICES_LIST_TABLE_HEADER") ===
                                0 ||
                                item.key.indexOf(this.filters[i] === 0)) &&
                            item.visible == true &&
                            item.name.indexOf(this.filters[i]) == 0
                        ) {
                            return item;
                        }
                    }
                });

                this.formatItemsTable(headers);
            } else {
                this.formatItemsTable(this.filters);
            }

            this.loadTableInfo();
        },
        formatItemsTable(arr) {
            let field = [];
            this.fields.push({ label: "", key: "select" });
            for (let key in arr) {
                let name = arr[key].customKey
                    ? arr[key].customKey
                    : arr[key].name
                    ? arr[key].name
                    : arr[key];
                switch (name) {
                    case "hostname":
                        name = "Device Name";
                        break;
                    case "ip":
                        name = "Ip Address";
                        break;
                    case "fwVersion":
                        name = "Firmware";
                        break;
                    case "wlanOpModeString":
                        name = "Wireless Mode";
                        break;
                    case "essid":
                        name = "SSID";
                        break;
                    default:
                        name = arr[key].customKey;
                        break;
                }
                field = {
                    label: name,
                    key: arr[key].name ? arr[key].name : arr[key],
                    sortable: true
                };

                this.fields.push(field);
            }
        },
        loadTableInfo() {
            api.get("/devices").then(response => {
                let data = response.data.results;
                this.$store.commit("UPDATE_ALL_DEVICES", data);
                let obj = {};
                let formatStatus = [];
                formatStatus[1] = {
                    status: "Not monitored",
                    _rowVariant: "info"
                };
                formatStatus[2] = { status: "online", _rowVariant: "success" };
                formatStatus[3] = { status: "offline", _rowVariant: "danger" };

                let info = [];

                for (let i = 0; i < data.length; i++) {
                    obj = data[i].properties;
                    let tempo = this.convertTime(obj.uptime);
                    let ip = this.intToIp(obj.ip);
                    obj.uptime = tempo;
                    obj.ip = ip;
                    obj.wlanOpModeString = this.getFormatByName(
                        "wlanOpMode",
                        obj.wlanOpMode
                    );
                    obj["deviceId"] = data[i].deviceId;
                    let variant = formatStatus[data[i].properties.status];
                    obj = Object.assign(obj, variant);

                    info.push(obj);
                }
                this.items = info;
            });
        },
        convertTime(time) {
            function transform(number) {
                if (number <= 9) {
                    number = "0" + number;
                }
                return number;
            }

            let hour = transform(Math.trunc(time / 3600));
            let minutes = transform(Math.trunc((time % 3600) / 60));
            //let seconds = transform((time%3600)%60);

            return isNaN(hour) && isNaN(minutes) ? "-" : `${hour}:${minutes}`;
        },
        intToIp(ipInt) {
            return (
                (ipInt >>> 24) +
                "." +
                ((ipInt >> 16) & 255) +
                "." +
                ((ipInt >> 8) & 255) +
                "." +
                (ipInt & 255)
            );
        },
        showDevice(obj) {
            this.deviceFull = true;
            this.device = obj;
        },
        preload(id) {
            this.items.filter(item => {
                if (item.deviceId == id) {
                    item.status = "load";
                    item._rowVariant = "info";
                }
            });
        },
        pushDevice(deviceId) {
            let arr = this.devicesArray;
            let device = arr.find(item => item == deviceId);

            if (device) {
                let index = arr.indexOf(device);
                arr.splice(index, 1);
            } else {
                arr.push(deviceId);
            }

            this.devicesArray = arr;
        },
        async deleteDevices() {
            let response = await this.confirmAction({
                title: "Atenção",
                body: "Deseja deletar o(s) dipsositivo(s) selecionado(s) ?"
            });

            if (response) {
                let res = {
                    title: "",
                    msg: "Removendo...",
                    type: "info"
                };
                this.$store.dispatch("updateResponseRequest", res);
                this.preload(this.devicesArray);
                let args = { device_ids: this.devicesArray };
                this.sendTask("delete", args);
            }
        },
        async startMonitoring() {
            let response = await this.confirmAction({
                title: "Atenção",
                body:
                    "Deseja iniciar o monitoramento do(s) dipsositivo(s) selecionado(s) ?"
            });

            if (response) {
                let res = {
                    title: "",
                    msg: "iniciando monitoramento...",
                    type: "info"
                };
                this.$store.dispatch("updateResponseRequest", res);
                this.preload(this.devicesArray);
                let args = { device_ids: this.devicesArray };
                this.sendTask("start_monitoring", args);
            }
        },
        showInput() {
            this.showSearch = !this.showSearch;
            setTimeout(() => {
                this.$nextTick(() => this.$refs.input.focus());
            }, 500);
        }
    },
    created() {
        if (getCookie("JSESSIONID")) {
            this.loadConfig();
            this.$store.dispatch("updateMetaInfo");
        }

        EventBus.$on("updateInfoDevice", $event => {
            this.device = $event.properties;
            this.deviceFull = true;
        });
    }
};
</script>

<style>
#toggle-topology {
    background: #191970;
    font-size: 2rem;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-radius: 25px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
}

#toggle-topology:hover {
    background: #1919c7;
}

.preload-table {
    text-align: left !important;
    padding: 10px;
}

p.not-found {
    margin: 5px;
}

.signal span.level {
    display: inline-block;
    width: 10px;
    height: 5px;
    background: #f2f2f2;
    margin: 2px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

#search {
    width: 400px;
    height: 50px;
    position: relative;
}

.btn-search {
    position: absolute;
    color: #191c21;
    background: transparent;
    z-index: 10;
}

.container-top {
    height: 50px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}

.inputFilter {
    width: 20px;
    height: 30px;
    border: none;
    border-radius: 15px;
    transition: all 0.3s;
    visibility: hidden;
    transition: all 0.3s ease-in;
    box-shadow: 0 0 2px #191c21;
    position: absolute;
}
.inputFilter:focus {
    outline: none;
    box-shadow: 0 0 4px #191c21;
}

.inputFilter.open {
    height: 30px;
    width: 100%;
    padding-left: 35px;
    padding-right: 5px;
    visibility: visible;
}

#status {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    margin: 0 auto;
}

#status.online {
    background: green;
}
#status.offline {
    background: red;
}
#status.not_monitored {
    background: #666;
}

#status.load {
    animation: load 0.3s alternate infinite;
}

.updateStatus {
    background: #1483eb;
    animation: load 0.3s alternate infinite;
}

.actions-tools span.title {
    font-size: 12px;
    margin-left: 10px;
}

.btn:focus {
  box-shadow: none !important;
}

@keyframes load {
    from {
        background: #1483eb;
    }

    to {
        background: transparent;
    }
}
</style>
