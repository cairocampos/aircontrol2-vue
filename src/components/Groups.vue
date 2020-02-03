<template>
    <div class="groups" v-if="groups != null">
        <p class="title">{{groups.name}}</p>
        <div v-for="item in groups.members" :key="item.groupId">
            <div class="group-expand">
                <div class="group--folder">
                    <div class="folder d-flex align-items-center mb-3" @click="expandMembers">
                        <span class="group--folder-icon mr-3" v-if="item.type == 'device_group'">
                            <i class="fas fa-folder-plus"></i>
                        </span>
                        <span
                            class="group--folder-icon ignored mr-3"
                            v-else-if="item.type == 'ignored'"
                        >
                            <i class="fas fa-ban"></i>
                        </span>
                        <span class="group--folder-title">{{item.name}}</span>
                    </div>
                    <div class="group--members mb-3" v-if="item.members.length > 0">
                        <div
                            class="group--folder"
                            v-for="(member, index) in item.members"
                            :key="index"
                        >
                            <div class="folder ml-3" @click="expandMembers">
                                <span class="group--folder-icon mr-3">
                                    <i class="fas fa-folder"></i>
                                </span>
                                <span class="group--folder-title">{{member.name}}</span>
                            </div>
                            <div class="group--members mb-3">
                                <div class="group--folder" v-if="member.members.length > 0">
                                    <div
                                        class="folder ml-5 my-3"
                                        v-for="(unit, index) in member.members"
                                        :key="index"
                                        @click="expandMembers"
                                    >
                                        <a
                                            href="#"
                                            class="device"
                                            @click.prevent="showInfo(unit)"
                                        >{{unit.name}}</a>
                                    </div>
                                </div>
                                <div class="group--members not-found" v-else>Nenhum item encontrado</div>
                            </div>
                        </div>
                    </div>
                    <div class="group--members not-found" v-else>Nenhum item encontrado</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/event-bus.js";
export default {
    name: "Groups",
    props: ["groups", "stateSnack"],
    computed: {
        ...mapGetters(["getDataDeviceById"])
    },
    methods: {
        expandMembers({ currentTarget }) {
            let member = currentTarget.parentNode.querySelector(
                ".group--members"
            );
            if (member != null) {
                member.classList.toggle("show");
            }
        },

        showInfo(obj) {
            let item = this.getDataDeviceById(obj.deviceId);
            EventBus.$emit("updateInfoDevice", item);
            this.$emit("closeSnackComponent");
        }
    }
};
</script>

<style scoped>
.folder {
    cursor: pointer;
    transition: all 0.3s;
    font-size: 1.2rem;
}

.folder:hover {
    color: #666;
}

.ignored {
    color: #ff5500;
}

.group--members .folder {
    font-size: 1rem;
}

.group-expand {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
    padding: 0 10px;
}

.group--members {
    visibility: hidden;
    height: 0;
    opacity: 0;
    transform: translate3d(0, -10px, 0);
    transition: transform 0.3s;
}

.group--members.show {
    visibility: visible;
    height: auto;
    opacity: 1;
    transform: translate3d(0, 0, 0);
}

a.device {
    color: #1919c7;
}

a.device:hover {
    color: blue;
}
</style>