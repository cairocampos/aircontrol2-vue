import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueDateFns from "vue-date-fns";
import ErrorNotification from "@/components/geral/ErrorNotification.vue";
import PreLoad from "@/components/geral/PreLoad.vue";
import ConfirmAction from "@/components/geral/ConfirmAction.vue";
import ResponseRequest from "@/components/geral/ResponseRequest.vue";
import VuejsDialog from "vuejs-dialog";
//import VuejsDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';

import "vuejs-dialog/dist/vuejs-dialog.min.css";

Vue.use(VuejsDialog, {
	html: true,
	loader: false,
	okText: "Confirmar",
	cancelText: "Cancelar",
	animation: "zoom"
});

Vue.component("ErrorNotification", ErrorNotification);
Vue.component("PreLoad", PreLoad);
Vue.component("ConfirmAction", ConfirmAction);
Vue.component("ResponseRequest", ResponseRequest);

// Registra a diretiva personalizada global chamada `v-focus`
Vue.directive("focus", {
	// Quando o elemento vinculado é inserido no DOM...
	inserted: function(el) {
		// Coloque o foco no elemento
		el.focus();
	}
});

Vue.filter("intToIp", function(ipInt) {
	return (
		(ipInt >>> 24) +
		"." +
		((ipInt >> 16) & 255) +
		"." +
		((ipInt >> 8) & 255) +
		"." +
		(ipInt & 255)
	);
});

Vue.filter("convertType", function(val) {
	var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (val == 0) return "n/a";

	var i = parseInt(Math.floor(Math.log(val) / Math.log(1024)));
	if (i == 0) return val + " " + sizes[i];

	return (val / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
});

Vue.use(BootstrapVue);
Vue.use(VueDateFns);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
