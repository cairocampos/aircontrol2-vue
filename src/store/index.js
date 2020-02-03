import Vue from "vue";
import Vuex from "vuex";
import { api } from "@/services.js";
import { removeToken } from "@/helpers.js";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		fullTasks: false,
		updateDevices: false,
		login: false,
		sessionUser: {
			csrfToken: "",
			email: "",
			hasDefaultPassword: "",
			id: "",
			isNew: "",
			role: "",
			sessionTimeout: "",
			username: "",
			webProperties: ""
		},
		userInfo: null,
		sidebar_expand: false,
		metaInfo: null,
		formaters: null,
		allRoles: null,
		itemsRequest: [],
		tasks: [],
		tasksPeriod: [],
		user: {
			id: "",
			username: "",
			firstName: "",
			lastName: "",
			email: "",
			role: {},
			sessionTimeout: ""
		},
		allUsers: [],
		allDevices: [],
		provideAuthDevice: { open: false, deviceId: null }
	},
	mutations: {
		UPDATE_SESSION_USER(state, payload) {
			state.sessionUser = payload;
		},
		UPDATE_USER(state, payload) {
			state.user = Object.assign(state.user, payload);
		},
		UPDATE_USERS(state, payload) {
			state.allUsers = payload;
		},
		UPDATE_USER_INFO(state, payload) {
			state.userInfo = payload;
		},
		UPDATE_DEVICES(state, payload) {
			state.updateDevices = payload;
		},
		UPDATE_ALL_DEVICES(state, payload) {
			state.allDevices = payload;
		},
		UPDATE_LOGIN(state, payload) {
			state.login = payload;
		},
		UPDATE_SIDEBAR_EXPAND(state, payload) {
			state.sidebar_expand = payload;
		},
		TASKS_PERIOD(state, payload) {
			state.tasksPeriod = payload;
		},
		UPDATE_TASK_RUNNING(state, payload) {
			state.tasks.push(payload);
		},
		REMOVE_TASK(state, payload) {
			let result = state.tasks.find(item => {
				return item.id == payload;
			});

			let index = state.tasks.indexOf(result);
			state.tasks.splice(index, 1);
		},
		UPDATE_META_INFO(state, payload) {
			state.metaInfo = payload;
		},
		UPDATE_FORMATERS(state, payload) {
			state.formaters = payload;
		},
		UPDATE_ROLES(state, payload) {
			state.allRoles = payload;
		},
		UPDATE_RESPONSE_REQUEST(state, payload) {
			state.itemsRequest.unshift(payload);
		},
		REMOVE_ITEM_REQUEST(state) {
			setTimeout(() => {
				let timer = setInterval(out, 2500);

				function out() {
					if (state.itemsRequest.length > 0) {
						state.itemsRequest.pop();
					} else {
						clearInterval(timer);
					}
				}
			}, 2500);
		},
		UPDATE_FULL_TASKS(state, payload) {
			state.fullTasks = payload;
		},
		PROVIDE_AUTH_DEVICE(state, payload) {
			state.provideAuthDevice = Object.assign(
				state.provideAuthDevice,
				payload
			);
		}
	},
	actions: {
		updateMetaInfo(context) {
			api.get("/devices/meta-info").then(response => {
				context.commit("UPDATE_META_INFO", response.data.all);
				let data = response.data.all;

				let filter = data.filter(item => {
					return item.hasOwnProperty("values");
				});
				context.commit("UPDATE_FORMATERS", filter);
			});
		},
		updateSessionUser(context) {
			api.get("/roles").then(response => {
				context.commit("UPDATE_ROLES", response.data.results);
			});

			return api.get("/users/session-user").then(response => {
				context.commit("UPDATE_SESSION_USER", response.data);
				context.commit("UPDATE_LOGIN", true);

				let infoArr = [];
				infoArr.push(response.data.id);
				infoArr.push(response.data.username);
				infoArr.push(response.data.email);
				infoArr.push(response.data.role);
				context.commit("UPDATE_USER_INFO", infoArr);
			});
		},
		updateUser(context, payload) {
			context.commit("UPDATE_USER", payload);
		},
		getUsers(context) {
			return api.get("/users").then(response => {
				context.commit("UPDATE_USERS", response.data.results);
			});
		},
		updateResponseRequest(context, payload) {
			context.commit("UPDATE_RESPONSE_REQUEST", payload);
		},
		removeItemRequest(context) {
			context.commit("REMOVE_ITEM_REQUEST");
		},
		updateTaskRunning(context, payload) {
			context.commit("UPDATE_TASK_RUNNING", payload);
		},
		getResultTask(context, payload) {
			let timer = setInterval(interval, 2500);

			function interval() {
				return api.get("/tasks?time=hour").then(response => {
					let data = response.data.results;
					let res = {};
					let task = data.find(item => item.id == payload);

					if (task.completed_on != null) {
						clearInterval(timer);

						if (!task.completion_summary.errors) {
							res = {
								title: "",
								msg: task.completion_summary.success.message,
								type: "success"
							};
						} else {
							if (
								task.events[0].error.code ==
								"missing_credentials_error"
							) {
								context.commit("PROVIDE_AUTH_DEVICE", {
									open: true,
									deviceId: task.args.device_ids[0]
								});
								res = {
									title: "Atenção",
									msg:
										"Forneça as credenciais para autenticar.",
									type: "auth"
								};
							} else {
								res = {
									title: "",
									msg: task.completion_summary.errors.message,
									type: "error"
								};
							}
						}
						context.commit("REMOVE_TASK", payload);
						context.commit("UPDATE_RESPONSE_REQUEST", res);
						context.commit("UPDATE_DEVICES", true);
					}
				});
			}
		},
		getTasksPeriod(context, payload) {
			return api.get(`/tasks?time=${payload}`).then(response => {
				let filter = response.data.results.filter(
					item => item.name != null
				);

				if (filter) {
					context.commit("TASKS_PERIOD", filter);
				} else {
					context.commit("TASKS_PERIOD", null);
				}
			});
		},
		updateProvideAuthDevice(context, payload) {
			context.commit("PROVIDE_AUTH_DEVICE", payload);
		},
		updateDevices(context, payload) {
			context.commit("UPDATE_DEVICES", payload);
		},
		updateFullTasks(context, payload) {
			context.commit("UPDATE_FULL_TASKS", payload);
		},
		logout(context) {
			api.post("/logout").then(() => {
				context.commit("UPDATE_SESSION_USER", {
					csrfToken: "",
					email: "",
					hasDefaultPassword: "",
					id: "",
					isNew: "",
					role: "",
					sessionTimeout: "",
					username: "",
					webProperties: ""
				});
			});
			removeToken();
		}
	},
	getters: {
		getFormatByName: state => (name, index) => {
			let filter = state.formaters.find(item => {
				return item.name == name;
			});

			let arr = [];

			Object.entries(filter.values).forEach(el => {
				arr[el[0]] = el[1];
			});

			return arr[index];
		},
		userRole: state => {
			return state.sessionUser.role.name;
		},
		getRole: state => id => {
			let filter = state.allRoles.find(item => {
				return item.id == id;
			});

			return filter;
		},
		getUsername: state => {
			return state.sessionUser.username;
		},
		getUsernameById: state => id => {
			let filter = state.allUsers.find(item => {
				return item.id == id;
			});

			if (filter) {
				return filter.username ? filter.username : filter.id;
			} else {
				return id;
			}
		},
		getDeviceById: state => id => {
			let filter = state.allDevices.find(item => {
				return item.deviceId == id;
			});

			return filter ? filter.summary.deviceNodeName : "-";
		},
		getDataDeviceById: state => id => {
			let filter = state.allDevices.find(item => {
				return item.deviceId == id;
			});

			return filter;
		}
	},
	modules: {}
});
