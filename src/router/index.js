import Vue from "vue";
import VueRouter from "vue-router";
import { getCookie } from "@/helpers.js";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Users from "../views/Users.vue";
import ScannerDevices from "../views/ScannerDevices.vue";
import Alerts from "../views/Alerts.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		component: Home,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/login",
		name: "login",
		component: Login,
		meta: {
			plainLayout: true,
		},
	},
	{
		path: "/users",
		name: "users",
		component: Users,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/scanner",
		name: "scanner",
		component: ScannerDevices,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/Alerts",
		name: "Alerts",
		component: Alerts,
		meta: {
			requiresAuth: true
		}
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (!getCookie("JSESSIONID")) {
			next("/login");
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
