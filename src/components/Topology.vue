<template>
    <div role="tablist" class="topology" v-if="topology != null">
        <b-card no-body class="mb-1 mt-0">
            <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                    block
                    href="#"
                    v-b-toggle="`accordion-${topology.groupId}`"
                    variant="dark"
                >
                    <i class="fas fa-server"></i>
                    {{topology.name.charAt(0).toUpperCase().concat(topology.name.substr(1,))}}
                </b-button>
            </b-card-header>
            <b-collapse :id="`accordion-${topology.groupId}`" visible role="tabpanel">
                <b-card-body>
                    <b-card-text class="topology--devices">
                        <table class="table-responsive">
                            <thead>
                                <tr>
                                    <th>
                                        <i class="fas fa-satellite-dish"></i> Devices
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody v-if="topology.members.length > 0">
                                <tr v-for="item in topology.members" :key="item.deviceId">
                                    <td>
                                        <a href @click.prevent="showInfo(item)">{{item.name}}</a>
                                    </td>
                                    <td class="remove">
                                        <a href>
                                            <i class="fas fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                            <p v-else class="no-results">Nenhum dispositivo encontrado</p>
                        </table>
                    </b-card-text>
                </b-card-body>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import EventBus from "@/event-bus.js";
import { mapGetters } from "vuex";
export default {
    name: "Topology",
    props: ["topology"],
    computed: {
        ...mapGetters(["getDataDeviceById"])
    },
    methods: {
        showInfo(obj) {
            let item = this.getDataDeviceById(obj.deviceId);
            EventBus.$emit("updateInfoDevice", item);
            this.$emit("closeSnackComponent");
        }
    }
};
</script>

<style>
.topology--devices {
    display: grid;
    grid-gap: 15px;
}

.topology table {
    color: #abb;
}

.topology table .remove a {
    color: #666;
}
.topology .card,
.topology .card-header {
    border: none !important;
    margin-top: 0px !important;
    margin: 0px !important;
}

.topology tbody tr {
    display: grid;
    grid-gap: 20px;
    grid-auto-flow: column;
}

.card-body:active,
.card-body:link,
.tab-pane.active {
    outline: none !important;
}

.no-results {
    font-size: 14px;
}
</style>