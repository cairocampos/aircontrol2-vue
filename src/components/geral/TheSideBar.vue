<template>
	<aside :class="{ expand: this.$store.state.sidebar_expand }">
		<nav>
			<div class="main">
				<router-link to="/">
					<span class="item-icon">
						<i class="fas fa-satellite-dish"></i>
					</span>
					Devices
				</router-link>
			</div>
			<div class="others">
				<router-link to="/scanner">
					<span class="item-icon">
						<i class="fas fa-crosshairs"></i>
					</span>
					Scanner
				</router-link>
				<a
					href="/tasks"
					class="position-relative"
					@click.prevent="$store.dispatch('updateFullTasks', true)"
					v-if="role == 'Administrator' || role == 'Device Manager'"
				>
					<span class="item-icon">
						<i class="fas fa-tasks"></i>
					</span>
					Tarefas
				</a>
				<router-link to="/alerts">
					<span class="item-icon">
						<i class="fas fa-bell"></i>
					</span>
					Alertas
				</router-link>
				<router-link to="/users" v-if="role == 'Administrator'">
					<span class="item-icon">
						<i class="fas fa-user-friends"></i>
					</span>
					Usuários
				</router-link>
			</div>
		</nav>

		<FullTasks v-if="$store.state.fullTasks" />
	</aside>
</template>

<script>
import FullTasks from "@/components/tasks/FullTasks.vue";
export default {
	name: "TheSideBar",
	components: {
		FullTasks
	},
	computed: {
		role() {
			return this.$store.getters.userRole;
		}
	},
	created() {
		const hash = window.location.hash;
		if (hash) {
			this.$store.dispatch("updateFullTasks", true);
		}
	}
};
</script>

<style scoped>
aside {
	min-height: calc(100vh - 56px);
	width: 55px;
	/*position: fixed;*/
	background: #191c21;
	top: 47px;
	overflow-x: hidden;
	transition: all 0.3s ease-in;
}

aside.expand {
	max-width: auto;
	width: 135px;
}

nav {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 90vh;
}

.item-icon {
	min-width: 55px;
	display: block;
	font-size: 1.5rem;
	text-align: center;
}

.main a,
.others a {
	display: flex;
	align-items: center;
	margin: 10px 0;
	color: #abb;
	transition: all 0.3s;
	padding-right: 15px;
}

.main a:hover,
.others a:hover,
.router-link-exact-active {
	color: #1919c7 !important;
}
</style>
