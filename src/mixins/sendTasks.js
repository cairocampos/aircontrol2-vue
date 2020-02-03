/*
 * @Mixins sendTasks
 * @params - eventName String, args Obj
 */
import store from "@/store";
import { api } from "@/services.js";
export default {
	methods: {
		sendTask: async (eventName, args) => {
			let obj = {};
			obj["name"] = eventName;
			obj["args"] = args;

			api.post("/tasks", JSON.stringify(obj)).then(response => {
				obj["id"] = response.data.id;
				store.dispatch("updateTaskRunning", obj);
				store.dispatch("getResultTask", response.data.id);

				return true;
			});
		}
	}
};
