<template>
    <header>
        <nav>
            <div id="toggle-menu" @click="sidebarToggle">
                <i class="fas fa-stream"></i>
            </div>
            <div class="d-flex align-items-center config">
                <div id="user-settings" @click="config">
                    <i class="far fa-user" data-el></i>
                    <div id="settings" :class="{ openSettings: isActive }">
                        <p class="username">{{ getUsername }}</p>
                        <span class="role">{{ userRole }}</span>
                        <a href="javascript:;" @click="showModalInfo">
                            <span>
                                <i class="fas fa-user-cog"></i>
                            </span>
                            Minha Conta
                        </a>
                        <a href="javascript:;">
                            <span>
                                <i class="fas fa-cog"></i>
                            </span>
                            Configurações
                        </a>
                        <a href @click.prevent="logout">
                            <span>
                                <i class="fas fa-sign-out-alt"></i>
                            </span>
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <PreviewTasks />

        <!--Modal-->
        <ModalInfo
            :modal="modalInfoState"
            :modalInfoState.sync="modalInfoState"
            :userInfo="userInfo"
        />

        <ProvideAuth v-if="provideAuthDevice.open" :deviceId="provideAuthDevice.deviceId" />
    </header>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ModalInfo from "@/components/user/ModalInfo.vue";
import PreviewTasks from "@/components/tasks/PreviewTasks.vue";
import ProvideAuth from "@/components/device/ProvideAuth.vue";
export default {
    name: "TheHeader",
    props: ["closeOpenSettings"],
    components: {
        ModalInfo,
        PreviewTasks,
        ProvideAuth
    },
    data() {
        return {
            isActive: false,
            sidebar_isActive: false,
            modalInfoState: false,
            userInfo: null
        };
    },
    computed: {
        ...mapGetters(["userRole", "getUsername"]),
        ...mapState(["provideAuthDevice"])
    },
    methods: {
        showModalInfo() {
            if (!this.modalInfoState) {
                this.modalInfoState = true;
                this.userInfo = this.$store.state.sessionUser;
            }
        },
        sidebarToggle() {
            this.sidebar_isActive = !this.sidebar_isActive;
            this.$store.commit("UPDATE_SIDEBAR_EXPAND", this.sidebar_isActive);
        },
        async logout() {
            await this.$store.dispatch("logout");
            this.$router.push("/login");
        },
        config() {
            this.isActive = !this.isActive;
        }
    },
    created() {
        document.querySelector("body").addEventListener("click", event => {
            let target = event.target.getAttribute("data-el");
            target === null ? (this.isActive = false) : "";
        });
    }
};
</script>

<style scoped>
header {
    background: #191970;
}

nav {
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#toggle-menu {
    color: #fff;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s;
}

#toggle-menu:hover {
    color: #abb;
}

#user-settings {
    color: #fff;
    cursor: pointer;
    font-size: 1.3rem;
    position: relative;
}

.config div {
    margin-left: 20px;
}

#settings {
    background: #fff;
    display: flex;
    flex-direction: column;
    position: absolute;
    right: -3px;
    box-shadow: 0 0 4px 0 #666;
    padding: 10px;
    width: 300px;
    margin-top: 15px;
    opacity: 0;
    visibility: hidden;
    height: 0;
    transition: all 0.3s;
}

#settings::after {
    content: "";
    display: block;
    background: #fff;
    width: 15px;
    height: 15px;
    position: absolute;
    right: 5px;
    top: -6px;
    transform: rotate(45deg);
}

#settings a {
    font-size: 14px;
    margin: 3px 0;
    transition: all 0.3s;
    color: #191970;
}

#settings a:hover {
    color: #1919c7;
}

.username {
    color: #666;
    padding: 0;
    margin: 0;
}

span.role {
    color: #191c21;
    font-size: 10px;
    border-bottom: 1px solid #999;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-weight: bold;
}

#settings.openSettings {
    opacity: 1;
    visibility: visible;
    height: auto;
    z-index: 999;
}
</style>
