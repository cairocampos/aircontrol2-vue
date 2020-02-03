<template>
    <div class="devices" :class="{show: showSnack}">
        <span class="close" @click="closeSnack">&times;</span>

        <b-card no-body>
            <b-tabs card>
                <b-tab title="Topologia" active>
                    <!-- <b-card-text>Topologia</b-card-text> -->
                    <Topology :topology="topology" @closeSnackComponent="closeSnack" />
                </b-tab>
                <b-tab title="Grupos">
                    <!-- <b-card-text>Grupos</b-card-text> -->
                    <Groups :groups="groups" @closeSnackComponent="closeSnack" />
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import Topology from "@/components/Topology.vue";
import Groups from "@/components/Groups.vue";
import { api } from "@/services.js";
export default {
    name: "Devices",
    props: ["showSnack"],
    components: {
        Topology,
        Groups
    },
    data() {
        return {
            stateSnack: this.showSnack,
            topology: null,
            groups: null
        };
    },
    methods: {
        closeSnack() {
            this.stateSnack = false;
            this.$emit("update:showSnack", this.stateSnack);
        }
    },
    created() {
        api.get("/views").then(response => {
            this.topology = response.data.topology;
            this.groups = response.data.groups;
        });
    }
};
</script>

<style>
.devices {
    max-width: 1200px;
    width: 1000px;
    background: #191c21;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 0px;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -500px;
    z-index: 99;
    transition: all 0.3s ease-in;
    overflow-y: overlay;
}

/*Scroll Custom*/
.devices::-webkit-scrollbar {
    width: 10px;
    background: transparent;
} /* configurando scroll */
.devices::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
}
.devices::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: transparent;
}

.devices.show {
    height: 500px;
}

.devices .close {
    background: #000;
    height: 20px;
    width: 20px;
    border-radius: 4px;
    text-align: center;
    line-height: 20px;
    color: #abb;
    position: fixed;
    font-size: 1rem;
    cursor: pointer;
    z-index: 1;
}

.devices .close:hover {
    color: #fff;
}

.devices .card {
    background: transparent !important;
    color: #abb;
}

.devices .card-header {
    border: none;
}

.devices .nav-tabs .nav-link {
    color: #f5f5f5;
    border: none;
}

.devices .nav-tabs {
    display: grid;
    justify-content: center;
    grid-auto-flow: column;
    grid-gap: 20px;
}

.devices .nav-item {
    background: transparent;
    border: none;
}

.devices .nav-link.active {
    /* background: #000 !important; */
    background: transparent !important;
    color: #f5f5f5;
    border-bottom: 2px solid;
    cursor: not-allowed !important;
}

.devices .nav-link:active,
.nav-link:focus {
    outline: none;
}
</style>