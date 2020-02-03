<template>
	<div
		:class="[
			'preview-tasks d-flex flex-column justify-content-between',
			{ showTasks: showTasks }
		]"
	>
		<button class="btn-custom btn-expand" @click="showTasks = !showTasks">
			<i class="fas fa-angle-down" v-if="showTasks"></i>
			<i class="fas fa-angle-up" v-else></i>
		</button>
		<div class="content">
			<div class="header">
				<p>Tarefas</p>
			</div>
			<div class="body py-2">
				<template v-if="tasks.length > 0">
					<div class="task" v-for="item in tasks" :key="item.id">
						<div
							class="d-flex justify-content-between align-items-center"
						>
							<p class="task-name">
								{{
									item.name
										.charAt(0)
										.toUpperCase()
										.concat(
											item.name
												.substr(1)
												.replace("_", " ")
										)
								}}
							</p>

							<button class="btn-custom stop">Cancelar</button>
						</div>
						<div class="bar mt-1">
							<div class="load-animation"></div>
						</div>
					</div>
				</template>
				<h6 v-else>Nenhuma tarefa</h6>
			</div>
			<div class="footer d-flex align-items-end justify-content-end">
				<button class="btn-custom info" @click="openFullTasks">
					Abrir
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "PreviewTasks",
	data() {
		return {
			showTasks: false
		};
	},
	computed: {
		...mapState(["tasks"])
	},
	methods: {
		openFullTasks() {
			this.$store.dispatch("updateFullTasks", true);
		}
	}
};
</script>

<style scoped>
.preview-tasks {
	background: #191c21;
	display: flex;
	flex-direction: column;
	position: fixed;
	left: 50%;
	box-shadow: 0 0 6px 0 #666;
	width: 600px;
	margin-left: -300px;
	visibility: visible;
	color: #abb;
	bottom: 0;
	max-height: 0;
	transition: max-height 0.3s ease-out;
}

.preview-tasks.showTasks {
	max-height: 500px;
	transition: max-height 0.3s ease-in;
}

.content {
	padding: 10px;
}

.header p {
	text-transform: uppercase;
	font-size: 14px;
	font-weight: bolder;
	letter-spacing: 2px;
}

.header {
	border-bottom: 1px solid #666;
}

.task {
	margin-bottom: 10px;
}

.task-name {
	font-size: 12px;
	margin: 0;
	padding: 0;
	font-weight: bold;
}

.btn-custom.btn {
	color: #fff;
	background: #1919c7;
}

.btn-custom.btn:hover {
	background: #191970;
}

.btn-custom.stop {
	border: 1px solid #abb;
	color: #abb;
	background: transparent;
	border-radius: 0;
}

.bar {
	width: 100%;
	height: 5px;
	background: rgb(143, 135, 135);
	border-radius: 5px;
	position: relative;
	overflow-x: hidden;
}

p {
	margin: 0;
	padding: 0;
}

.load-animation {
	width: 20%;
	height: 100%;
	background: rgb(63, 57, 57);
	position: absolute;
	animation: load 0.6s forwards infinite;
}

@keyframes load {
	from {
		left: 0;
	}

	to {
		left: 100%;
	}
}

.btn-expand {
	width: 50px;
	left: 50%;
	margin-left: -25px;
	position: absolute;
	top: -25px;
	background: #191c21;
}
</style>
