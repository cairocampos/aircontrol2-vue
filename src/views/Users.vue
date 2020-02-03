<template>
	<div class="users">
		<div class="view-header d-flex justify-content-between px-2">
			<div class="view-title">Usuários</div>
			<button class="btn-custom info" @click="userAdd">Novo</button>
		</div>

		<b-table hover striped :fields="fields" :items="items" class="mt-3">
			<template v-slot:cell(actions)="row">
				<button
					class="btn-custom btn-incolor m-0 py-0"
					@click="info(row.item)"
				>
					<i class="fas fa-pencil-alt"></i>
				</button>
				<span
					class="is_me"
					disabled
					v-if="row.item.id == $store.state.sessionUser.id"
				>
					<i class="fas fa-check"></i>
				</span>
				<button
					class="btn-custom btn-incolor"
					v-else
					@click="confirmDel(row.item)"
				>
					<i class="fas fa-trash-alt"></i>
				</button>
			</template>
		</b-table>

		<ModalInfo
			:modal="modalInfoState"
			:modalInfoState.sync="modalInfoState"
			:userInfo="userInfo"
			@updateTable="updateTable"
		/>
		<ModalAdd
			:modal="modalAddState"
			:modalAddState.sync="modalAddState"
			@updateTable="updateTable"
		/>

		<ConfirmAction
			:title="confirm.title"
			:description="confirm.description"
			:confirm="confirmComponent"
			:confirmComponent.sync="confirmComponent"
		>
			<template v-slot:btnAction>
				<button class="btn-custom expand danger" @click="del">
					Remover
				</button>
			</template>
		</ConfirmAction>
	</div>
</template>
<script>
// Update user -> PATCH Não é permitido alterar permissões se usuário estiver online

import { api } from "@/services.js";
import ModalInfo from "@/components/user/ModalInfo.vue";
import ModalAdd from "@/components/user/ModalAdd.vue";

export default {
	name: "Users",
	components: {
		ModalInfo,
		ModalAdd
	},
	data() {
		return {
			confirm: {
				title: "",
				description: ""
			},
			modalInfoState: false,
			modalAddState: false,
			confirmComponent: false,
			userInfo: null,
			userSelectedId: 0,
			fields: [
				{
					label: "username",
					key: "username",
					sortable: true
				},
				{
					label: "nome",
					key: "firstName",
					sortable: true
				},
				{
					label: "sobrenome",
					key: "lastName",
					sortable: true
				},
				{
					label: "email",
					key: "email",
					sortable: true
				},
				{
					label: "função",
					key: "role",
					sortable: true
				},
				{
					label: "",
					key: "actions",
					sortable: false
				}
			],
			items: []
		};
	},
	methods: {
		updateTable() {
			this.getUsers();
		},
		getUsers() {
			api.get("/users").then(response => {
				let data = response.data.results;
				let arrItems = [];

				for (let i = 0; i < response.data.total; i++) {
					let obj = {};
					obj.id = data[i].id;
					obj.username = data[i].username;
					obj.firstName = data[i].firstName ? data[i].firstName : "-";
					obj.lastName = data[i].lastName ? data[i].lastName : "-";
					obj.email = data[i].email ? data[i].email : "-";
					obj.role = data[i].role.name;

					arrItems.push(obj);
				}

				this.items = arrItems;
			});
		},
		userAdd() {
			this.modalAddState = true;
		},
		info({ id }) {
			this.modalInfoState = true;
			this.userInfo = null;
			if (id == this.$store.state.sessionUser.id) {
				this.userInfo = this.$store.state.sessionUser;
			} else {
				api.get(`/users/${id}`).then(response => {
					this.userInfo = response.data;
				});
			}
		},
		confirmDel({ id }) {
			this.confirm.title = "Atenção!";
			this.confirm.description =
				"Deseja remover esse usuário permanentemente ?";
			this.userSelectedId = id;
			this.confirmComponent = true;
		},
		del() {
			this.confirmComponent = false;
			api.delete(`/users/${this.userSelectedId}`)
				.then(response => {
					if (response.status == 204) {
						let res = {
							title: "Sucesso",
							msg: "Usuário removido com sucesso!",
							type: "success"
						};
						this.$store.dispatch("updateResponseRequest", res);
						this.getUsers();
					}
				})
				.catch(error => {
					let res = {
						title: "Falha",
						msg: error.data.message,
						type: "success"
					};
					this.$store.dispatch("updateResponseRequest", res);
				});
		}
	},
	created() {
		this.$store.dispatch("updateSessionUser");
		this.getUsers();
	}
};
</script>

<style scoped>
.is_me {
	color: #191970;
	margin: 4px;
	padding: 0px 10px;
	border-radius: 4px;
}

i {
	font-size: 14px;
}

.btn-incolor:hover {
	color: #1919c7;
}
</style>
