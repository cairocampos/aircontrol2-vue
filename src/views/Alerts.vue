<template>
	<div class="alerts">
		<div
			class="view-header d-flex justify-content-between align-items-center px-2 mb-3"
		>
			<div class="view-title">Alertas</div>

			<div
				id="search"
				:class="['d-flex align-items-center', { open: showSearch }]"
			>
				<button
					class="btn-custom btn-search my-0"
					@click="showInput"
					v-b-tooltip.hover
					title="Pesquisar"
				>
					<i class="fas fa-search"></i>
				</button>
				<input
					ref="input"
					:class="['inputFilter', { open: showSearch }]"
					v-model="search"
					type="search"
					id="filterInput"
					placeholder="Digite para buscar..."
				/>
			</div>
		</div>

		<b-table
			striped
			hover
			:items="items"
			:fields="fields"
			:filter="search"
			show-empty
		>
			<template v-slot:empty>Nenhum item a ser exibido</template>
			<template v-slot:emptyfiltered>Nenhum item encontrado</template>
		</b-table>
	</div>
</template>

<script>
export default {
	name: "Alerts",
	data() {
		return {
			showSearch: false,
			search: "",
			fields: [
				{ label: "Severidade", key: "severity", sortable: true },
				{ label: "Alerta", key: "alert", sortable: true },
				{ label: "Tempo", key: "time", sortable: true },
				{ label: "Dispositivo", key: "device", sortable: true }
			],
			items: []
		};
	},
	methods: {
		showInput() {
			this.showSearch = !this.showSearch;
			setTimeout(() => {
				this.$nextTick(() => this.$refs.input.focus());
			}, 500);
		}
	}
};
</script>

<style scoped>
#search {
	width: 400px;
	overflow: hidden;
	justify-content: flex-end;
	transition: all 0.3s;
}

#search.open {
	justify-content: start;
	overflow: visible;
}

.btn-custom {
	position: static;
}
</style>
