<template>
    <div :class="[{show: deviceFull}, 'infoDevice']" v-if="device">
        <div class="box--header d-flex justify-content-between align-items-center px-3">
            <div class="device--name d-flex align-items-center">
                <span
                    :class="['device--status mr-2', device.status.replace(' ', '_').toLowerCase()]"
                ></span>
                {{device.hostname}}
            </div>
            <div class="box--config d-flex">
                <a
                    class="item-icon"
                    v-b-tooltip.hover
                    title="Web"
                    :href="`http://${device.ip}`"
                    target="_blank"
                >
                    <i class="fas fa-external-link-alt"></i>
                </a>
                <button class="item-icon" v-b-tooltip.hover title="Detalhes">
                    <i class="fas fa-stream"></i>
                </button>
                <button class="item-icon" @click="close">X</button>
            </div>
        </div>
        <div class="box--tools d-flex align-items-center justify-content-between px-3">
            <div>
                <button class="item-icon tool" v-b-tooltip.hover title="Visualizar no mapa">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
                <template v-if="role != 'Device Monitor'">
                    <button
                        @click="confirmStopMonitoring(device.deviceId, device.hostname)"
                        class="item-icon tool"
                        v-b-tooltip.hover
                        title="Parar monitoramento"
                        v-if="device.status != 'Not monitored' "
                    >
                        <i class="far fa-stop-circle"></i>
                    </button>
                    <button
                        @click="confirmStartMonitoring(device.deviceId, device.hostname)"
                        class="item-icon tool"
                        v-b-tooltip.hover
                        title="Iniciar monitoramento"
                        v-else
                    >
                        <i class="far fa-play-circle"></i>
                    </button>
                    <button class="item-icon tool" v-b-tooltip.hover title="Configurar">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="item-icon tool" v-b-tooltip.hover title="Exibir informações">
                        <i class="fas fa-eye"></i>
                    </button>
                </template>
            </div>
            <div v-if="role != 'Device Monitor' ">
                <p class="text-muted" v-if="device.status != 'Not monitored' ">Monitorando</p>
                <p class="text-muted" v-else>Não Monitorado</p>
            </div>
        </div>
        <div class="device-container px-3">
            <div class="device--info-basic">
                <h6 class="text-muted my-2">Informações básicas</h6>
                <div class="info-container">
                    <div class="info flex-column justify-content-center align-items-center">
                        <p class="info-name text-muted">SSID</p>
                        <p class="info-value">{{device.essid}}</p>
                    </div>

                    <div class="info flex-column justify-content-center align-items-center">
                        <p class="info-name text-muted">IP</p>
                        <p class="info-value">{{device.ip}}</p>
                    </div>

                    <div class="info flex-column justify-content-center align-items-center">
                        <p class="info-name text-muted">MAC</p>
                        <p class="info-value">{{device.mac}}</p>
                    </div>

                    <div class="info flex-column justify-content-center align-items-center">
                        <p class="info-name text-muted">FIRMWARE</p>
                        <p class="info-value">{{device.fwVersion}}</p>
                    </div>

                    <div class="info flex-column justify-content-center align-items-center">
                        <p class="info-name text-muted">WIRELESS MODE</p>
                        <p class="info-value">{{getFormatByName('wlanOpMode', device.wlanOpMode)}}</p>
                    </div>

                    <div class="info flex-column justify-content-center align-items-center">
                        <p class="info-name text-muted">NETWORK MODE</p>
                        <p class="info-value">{{getFormatByName('netMode', device.netMode)}}</p>
                    </div>
                </div>
            </div>

            <button
                @click="confirmStartMonitoring(device.deviceId, device.hostname)"
                class="btn btn-dark btn-block"
                v-if="device.status == 'Not monitored'"
            >Iniciar Monitoramento</button>
            <div v-if="device.status == 'online' ">
                <div class="device--info-advanced pb-3">
                    <div class="signal_level info-area">
                        <div class="signal-label w-100 pt-2 d-flex justify-content-between">
                            <div class="signal-label-content">
                                <span class="label text-muted">Signal</span>
                                <span class="value ml-2">-</span>
                            </div>
                            <div class="signal-label-content">
                                <span class="label text-muted">Chain Imbalance</span>
                                <span class="value ml-2">-</span>
                            </div>
                        </div>

                        <div class="signal-content">
                            <span class="label">01</span>
                            <div class="signal-content-level"></div>
                            <span class>-</span>
                        </div>
                        <div class="signal-content">
                            <span class="label">02</span>
                            <div class="signal-content-level"></div>
                            <span class>-</span>
                        </div>
                    </div>
                </div>

                <!-- Memory Usage Bar-->
                <p class="text-muted text-center">Memory Usage</p>
                <div class="value bar">
                    <div
                        class="bar-content"
                        :style="{width: device['memUsage~current'] + '%'}"
                    >{{device["memUsage~current"]}}%</div>
                </div>
                <!--  -->

                <div class="device--info-additional py-3">
                    <div class="info-area-additional column-1">
                        <div class="label text-muted">Frequency</div>
                        <div class="value">{{device['freq@ath0']}} MHz</div>

                        <div class="label text-muted">Modulation Rate TX</div>
                        <div class="value">{{getFormatByName('txModRate', device.txModRate)}}</div>

                        <div class="label text-muted">Rate TX</div>
                        <div class="value">{{device['txRate@ath0~current']}} Mbps</div>

                        <div class="label text-muted">Uptime</div>
                        <div class="value">{{device.uptime}}</div>

                        <div class="label text-muted">Clientes Number</div>
                        <div class="value">{{device["numClients@ath0~current"]}}</div>

                        <div class="label text-muted">Bytes TX</div>
                        <div class="value">{{device["txBytesTotal@ath0"] | convertType}}</div>
                    </div>

                    <div class="info-area-additional column-2">
                        <div class="label text-muted">Lan Speed</div>
                        <div class="value">{{getFormatByName('lanSpeed', device.lanSpeed)}}</div>

                        <div class="label text-muted">Modulation Rate RX</div>
                        <div class="value">{{getFormatByName('rxModRate', device.rxModRate)}}</div>

                        <div class="label text-muted">Rate RX</div>
                        <div class="value">{{device['rxRate@ath0~current']}} Mbps</div>

                        <div class="label text-muted">Wireless Uptime</div>
                        <div
                            class="value"
                        >{{device['wlanUpTime@ath0'] == 0 ? '-' : device['wlanUpTime@ath0']}}</div>

                        <div class="label text-muted">Bytes RX</div>
                        <div class="value">{{device["rxBytesTotal@ath0"] | convertType}}</div>

                        <div class="label text-muted" style="display: block;">Memory Usage</div>
                        <div class="value">{{device["memUsage~current"]}}%</div>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmAction
            :title="confirm.title"
            :description="confirm.description"
            :confirm="confirmComponent"
            :confirmComponent.sync="confirmComponent"
        >
            <template v-slot:btnAction>
                <button
                    class="btn-custom expand success"
                    v-if="confirm.action == 'start'"
                    @click="startMonitoring"
                >Iniciar</button>
                <button
                    class="btn-custom expand danger"
                    v-if="confirm.action == 'stop'"
                    @click="stopMonitoring"
                >Parar</button>
            </template>
        </ConfirmAction>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import ConfirmAction from "@/components/geral/ConfirmAction.vue";
import sendTask from "@/mixins/sendTasks.js";
export default {
    props: ["device", "deviceFull"],
    name: "InfoDevice",
    components: {
        ConfirmAction
    },
    mixins: [sendTask],
    data() {
        return {
            confirmComponent: false,
            startUpdateStatus: false,
            deviceSelected: [],
            confirm: {
                title: "",
                description: "",
                action: ""
            }
        };
    },
    computed: {
        ...mapGetters(["getFormatByName"]),
        role() {
            return this.$store.getters.userRole;
        }
    },
    methods: {
        close() {
            this.$emit("update:deviceFull", false);
        },
        async load() {
            await this.$store.dispatch("updateFormaters");
            this.array = this.$store.state.formaters;
        },
        async format(name, index) {
            await this.$store.dispatch("updateFormaters");
            let data = await this.$store.state.formaters;

            let filter = data.find(item => {
                return item.name == name;
            });
            let arr = [];

            Object.values(filter.values).forEach(el => {
                arr.push(el);
            });

            return arr[index];
        },
        confirmStopMonitoring(deviceId, deviceName) {
            this.deviceSelected = [];
            this.confirmComponent = true;
            this.deviceSelected.push(deviceId);
            this.confirm.title = "Parar o monitoramento desse dispositivo ?";
            this.confirm.description = `Deseja parar o monitoramento do dispositivo "<strong>${deviceName}</strong>" ?`;
            this.confirm.action = "stop";
        },
        async stopMonitoring() {
            this.confirmComponent = false;
            this.close();
            let args = { device_ids: this.deviceSelected };
            this.sendTask("stop_monitoring", args);

            let res = {
                title: "",
                msg: "Parando monitoramento...",
                type: "info"
            };
            this.$store.dispatch("updateResponseRequest", res);
            this.$emit("updateStatus", this.deviceSelected);
        },
        confirmStartMonitoring(deviceId, deviceName) {
            this.deviceSelected = [];
            this.confirmComponent = true;
            this.deviceSelected.push(deviceId);
            this.confirm.title = "Iniciar o monitoramento desse dispositivo ?";
            this.confirm.description = `Deseja iniciar o monitoramente do dispositivo "<strong>${deviceName}</strong>" ?`;
            this.confirm.action = "start";
        },
        startMonitoring() {
            this.confirmComponent = false;
            this.close();
            let args = { device_ids: this.deviceSelected };
            this.sendTask("start_monitoring", args);

            let res = {
                title: "",
                msg: "iniciando monitoramento...",
                type: "info"
            };
            this.$store.dispatch("updateResponseRequest", res);
            this.$emit("updateStatus", this.deviceSelected);
        }
    }
};
</script>

<style scoped>
.infoDevice {
    height: calc(100% - 56px);
    background: #191c21;
    position: fixed;
    right: 0;
    top: 56px;
    color: #fff;
    overflow-y: overlay;
    transition: all 0.3s;
    width: 0;
}
.infoDevice.show {
    width: 500px;
}

/*Scroll Custom*/
.infoDevice::-webkit-scrollbar {
    width: 10px;
    background: #191c21;
} /* configurando scroll */
.infoDevice::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
}
.infoDevice::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #666;
}

.box--header,
.box--tools {
    height: 30px;
    top: 0;
    width: 100%;
    background: #111;
}

.device--name {
    font-size: 14px;
}

.device--status {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    display: block;
}

.item-icon {
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 1;
    color: #666;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.5;
    margin-left: 10px;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
    border: none;
}

.item-icon.tool {
    color: #f2f2f2;
}

.item-icon:hover {
    color: #abb;
}

.device--status.not_monitored {
    background: #666;
}
.device--status.online {
    background: green;
}
.device--status.offline {
    background: red;
}

p {
    margin: 0;
    padding: 0;
}

.info-name {
    font-size: 12px;
    text-transform: uppercase;
}

.info-value {
    font-size: 12px;
}

.info-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    margin: 10px 0;
}

.device--info-basic {
    border-bottom: 2px solid #999;
}

.device--info-advanced {
    border-bottom: 2px solid #999;
    margin-bottom: 10px;
}

.info-area .label {
    font-size: 12px;
}

.signal-content {
    display: grid;
    grid-template-columns: 10px 1fr auto;
    grid-gap: 10px;
    align-items: center;
}

.signal-content-level {
    width: 100%;
    background: #666;
    height: 10px;
}

.device--info-additional {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: column;
    grid-gap: 10px;
    font-size: 12px;
}

.info-area-additional {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
}

.info-area-additional .value {
    text-align: right;
}

.value.bar,
.bar-content {
    width: 100%;
    height: 15px;
    background: #666;
    position: relative;
}

.bar-content {
    background: #e80;
    position: absolute;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
}

.updateStatus {
    background: #1483eb;
    animation: load 0.3s alternate infinite;
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