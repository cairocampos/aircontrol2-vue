<template>
    <div class="modal-bg">
        <div class="md-container">
            <div class="md-header mb-4">
                <div class="md-title">{{title}}</div>
                <slot name="modalHeader"></slot>
                <slot name="modalClose"></slot>
            </div>

            <div class="md-body">
                <slot name="modalBody"></slot>
            </div>

            <div class="md-footer">
                <slot name="modalFooter"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ModalDefault",
    props: ["title"]
};
</script>

<style scoped>
.modal-bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
}

.md-container {
    position: absolute;
    min-width: 500px;
    min-width: 600px;
    height: auto;
    background: #f5f5f5;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
}

.md-header {
    display: flex;
    justify-content: space-between;
}

.md-title {
    font-size: 1.2rem;
    letter-spacing: 2px;
}

.md-close {
    border: none;
    background: transparent;
    color: #666;
    font-weight: bold;
    font-size: 1.5rem;
    position: absolute;
    right: 5px;
    top: 5px;
    transition: all 0.3s;
}

.md-close:hover {
    color: #222;
}

.md-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
