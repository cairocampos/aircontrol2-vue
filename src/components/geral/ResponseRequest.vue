<template>
    <div
        v-if="$store.state.itemsRequest.length > 0 ? closed() : ''"
        class="response-container d-flex flex-column"
    >
        <transition-group name="slide-fade">
            <div
                v-for="(response, index) in $store.state.itemsRequest"
                :key="index"
                :class="['response mb-3', response.type == 'auth' ? 'auth' : '']"
            >
                <div class="bloco">
                    <button class="btn-custom">&times;</button>

                    <div :class="'icon-'+response.type" v-html="icon(response.type)"></div>
                    <div v-if="response.title">{{response.title}}</div>
                    <div
                        :class="['body mt-1', response.type == 'auth' ? 'auth' : '']"
                        v-html="response.msg"
                    ></div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
    name: "ResponseRequest",
    props: {
        requestData: Array
    },
    methods: {
        closed() {
            this.$store.dispatch("removeItemRequest");
            return true;
        },
        icon(type) {
            let icon = "";
            switch (type) {
                case "success":
                    icon = '<i class="fas fa-check-circle"></i>';
                    break;
                case "error":
                    icon = '<i class="fas fa-times-circle"></i>';
                    break;
                case "warning":
                    icon = '<i class="fas fa-exclamation-circle"></i>';
                    break;
                case "info":
                    icon = '<i class="fas fa-info-circle"></i>';
                    break;
                case "auth":
                    icon = '<i class="fas fa-key"></i>';
                    break;
            }

            return icon;
        }
    }
};
</script>

<style scoped>
.response-container {
    position: fixed;
    top: 10%;
    right: 10px;
    min-height: 100vh;
    z-index: 9999;
}
.response {
    background: #191c21;
    width: 300px;
    min-height: 40px;
    max-height: 60px;
    border-radius: 4px;
    color: #abb;
    padding: 10px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    position: relative;
}

.bloco {
    display: grid;
    grid-template-columns: minmax(0, 20px) 1fr;
    grid-template-rows: 1fr;
}

button {
    background: transparent;
    position: absolute;
    right: 5px;
    top: 0;
    padding: 0;
}

.body {
    font-size: 12px;
    color: #999;
    grid-column: 2;
}

.icon-success {
    color: rgb(72, 197, 72);
}
.icon-error {
    color: rgb(255, 0, 0);
}
.icon-warning {
    color: rgb(253, 159, 36);
}

.icon-info {
    color: #1483eb;
}

.icon-auth {
    color: #fff;
}

.response.auth {
    background: rgb(0, 102, 255);
    color: #fff;
}

.body.auth {
    color: #fff;
}
</style>