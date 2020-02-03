<template>
    <div v-if="confirmComponent" class="confirm-container d-flex justify-content-center">
        <transition>
            <div class="confirm">
                <div class="header">
                    <div class="titulo text-center lead">{{ title }}</div>
                    <button class="btn-close" @click="cancelAction">&times;</button>
                </div>
                <div
                    class="body d-flex align-items-center justify-content-center"
                    v-html="description"
                ></div>
                <div class="footer d-flex align-items-end justify-content-center">
                    <button class="btn-custom expand grey" @click="cancelAction">Cancelar</button>
                    <slot name="btnAction"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "ConfirmAction",
    props: ["title", "description", "confirmComponent"],
    methods: {
        cancelAction() {
            this.$emit("update:confirmComponent", false);
            this.$emit("cancelAction");
        }
    }
};
</script>

<style scoped>
.confirm-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.confirm {
    width: auto;
    height: 200px;
    padding: 20px;
    position: absolute;
    top: 20%;
    background: #191c21;
    border-radius: 4px;
    display: grid;
}

.titulo,
.body {
    color: #abb;
}

.titulo {
    font-size: 24px;
}

.btn-close {
    background: transparent;
    border: none;
    font-size: 24px;
    position: absolute;
    right: 5px;
    top: -5px;
    transition: all 0.3s;
}

.btn-close:hover {
    color: #abb;
}

.footer .btn-custom {
    width: 100px;
}
</style>
