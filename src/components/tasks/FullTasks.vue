<template>
    <div class="tasks-container d-flex justify-content-center" @click="closeOut">
        <div class="tasks-content" v-show="!detail">
            <button class="btn-close" @click="close">&times;</button>
            <div class="tasks--header">
                <b-card no-body>
                    <b-tabs card>
                        <b-tab title="Completados" active>
                            <!--  -->
                            <div class="tasks--filter">
                                <select v-model="period">
                                    <option value="today">24 Horas</option>
                                    <option value="hour">Última Hora</option>
                                    <option value="all">Todos</option>
                                </select>
                            </div>
                            <PreLoad v-if="!items.length && !aux" />
                            <div
                                v-else-if="
									items.length > 0 && fields.length > 0
								"
                                class="tasks--body"
                            >
                                <b-table
                                    sticky-header
                                    striped
                                    hover
                                    :fields="fields"
                                    :items="items"
                                    head-variant="dark"
                                    @row-clicked="showDetails"
                                >
                                    <template v-slot:cell(icon)="data">
                                        <span v-html="data.value"></span>
                                    </template>
                                </b-table>
                            </div>
                            <div v-else>
                                <p>Nenhum registro encontrado!</p>
                            </div>

                            <!--  -->
                        </b-tab>
                        <b-tab title="Andamento">
                            <b-card-text>Teste..</b-card-text>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </div>
        </div>

        <TaskDetail v-show="detail" :detailInfo="detailInfo" :detail.sync="detail" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { parseISO, getTime } from "date-fns";
import TaskDetail from "@/components/tasks/TaskDetail.vue";

export default {
    name: "FullTasks.vue",
    components: { TaskDetail },
    data() {
        return {
            detail: false,
            detailInfo: null,
            period: "today",
            fields: [
                { label: "", key: "icon" },
                { label: "Tarefa", key: "task" },
                { label: "Inicio", key: "created_on" },
                { label: "Duração", key: "duration" },
                { label: "Usuário", key: "user" },
                { label: "Mensagem", key: "message" }
            ],
            items: [],
            aux: false
        };
    },
    computed: {
        ...mapGetters(["getUsernameById"])
    },
    watch: {
        period() {
            this.formatTable();
        }
    },
    methods: {
        async formatTable() {
            this.items = [];
            this.aux = false;
            await this.$store.dispatch("getUsers");
            await this.$store.dispatch("getTasksPeriod", this.period);
            let elements = this.$store.state.tasksPeriod;
            let arr = [];

            elements.length > 0 ? (this.aux = false) : (this.aux = true);

            for (let key in elements) {
                let obj = {};
                obj["task"] = elements[key].name
                    ? elements[key].name.replace("_", " ")
                    : "";
                let type = obj["task"].split(" ");
                type = type[0];
                obj["icon"] = this.drawIcon(type);

                let started = parseISO(elements[key].created_on);
                let end = parseISO(elements[key].completed_on);
                let duration = getTime(end) - getTime(started);

                obj["created_on"] = this.$date(started, "DD-MM-YYYY HH:mm:ss");
                obj["duration"] =
                    duration == 0 ? "00:00" : this.$date(duration, "mm:ss");
                obj["user"] = this.getUsernameById(elements[key].user_id);

                if (elements[key].completion_summary) {
                    let msg = "",
                        status = "";
                    switch (elements[key].completion_summary.result) {
                        case "success":
                            msg =
                                elements[key].completion_summary.success
                                    .message;
                            status = "success";
                            break;
                        case "failed":
                            msg =
                                elements[key].completion_summary.errors.message;
                            status = "danger";
                            break;
                        case "canceled":
                            msg =
                                elements[key].completion_summary.errors.message;
                            status = "danger";
                            break;
                    }

                    obj["message"] = msg;
                    obj["_rowVariant"] = status;
                    obj["details"] = elements[key].events;
                    obj["taskId"] = elements[key].id;
                }
                arr.push(obj);
            }

            this.items = arr;
        },
        close({ target, currentTarget }) {
            if (target === currentTarget) {
                this.$store.dispatch("updateFullTasks", false);
                window.history.pushState(null, null, "/");
            }
        },
        closeOut({ target, currentTarget }) {
            if (target === currentTarget) {
                this.$store.dispatch("updateFullTasks", false);
                window.history.pushState(null, null, "/");
            }
        },
        showDetails(event) {
            this.detail = true;
            this.detailInfo = event;
        },
        drawIcon(type) {
            let icon = "";
            switch (type) {
                case "start":
                    icon = '<i class="far fa-play-circle"></i>';
                    break;
                case "stop":
                    icon = '<i class="far fa-stop-circle"></i>';
                    break;
                case "delete":
                    icon = '<i class="far fa-trash-alt"></i>';
                    break;
                case "discovery":
                    icon = '<i class="fas fa-crosshairs"></i>';
                    break;
                case "check":
                    icon = '<i class="fas fa-key"></i>';
                    break;
                case "reconnect":
                    icon = '<i class="fas fa-redo-alt"></i>';
                    break;
            }

            return icon;
        }
    },
    created() {
        this.formatTable();
        window.history.pushState(null, null, "#tasks");
    }
};
</script>

<style>
.tasks-container {
    background: rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
}

.tasks-content {
    min-width: 1000px;
    max-height: 600px;
    background: #fff;
    border-radius: 4px;
    margin-top: 30px;
    position: relative;
    padding: 10px;
}

.tasks-content .btn-close {
    background: transparent;
    border: none;
    font-size: 24px;
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 99;
}

.tasks-content .header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.tasks-content .b-table-sticky-header {
    min-height: 500px;
}

.tasks--filter select {
    background: #191c21;
    color: #fff;
    padding: 0 10px;
    border-radius: 4px;
    font-size: 12px;
}

.tasks-content .card-header {
    border: none;
}

.tasks-content .nav-tabs .nav-link {
    color: #191c21;
    border: none;
}

.tasks-content .nav-tabs {
    display: grid;
    justify-content: center;
    grid-auto-flow: column;
    grid-gap: 20px;
}

.tasks-content .nav-item {
    background: transparent;
    border: none;
}

.tasks-content .nav-link.active {
    /* background: #000 !important; */
    background: transparent !important;
    color: #1919c7 !important;
    cursor: not-allowed !important;
    border-bottom: 2px solid #1919c7 !important;
}

.tasks-content .nav-link:active,
.nav-link:focus {
    outline: none;
}

.tasks-content .card {
    border: none !important;
}

.tasks-content .card-header {
    background: transparent;
}

.tasks-content .card-body {
    margin: 0;
    padding: 0;
    height: 100%;
}
</style>
