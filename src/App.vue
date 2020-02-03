<template>
	<div id="app">
		<div v-if="!$route.meta.plainLayout">
			<TheHeader />
			<main>
				<TheSideBar />
				<div id="view-main">
					<transition>
						<router-view />
					</transition>
				</div>
			</main>
		</div>

		<div v-if="$route.meta.plainLayout">
			<router-view />
		</div>

		<!-- Notifications -->
		<ResponseRequest :requestData="this.$store.state.responseRequest" />
	</div>
</template>

<script>
import TheHeader from "@/components/geral/TheHeader.vue";
import TheSideBar from "@/components/geral/TheSideBar.vue";

export default {
	name: "App",
	components: {
		TheHeader,
		TheSideBar
	}
};
</script>

<style>
* {
	box-sizing: border-box;
	font-family: "Avenir", Arial, Helvetica, sans-serif;
}

body,
ul,
li,
h1,
p {
	margin: 0;
	padding: 0;
}

ul {
	list-style: none;
}

label {
	margin-bottom: 10px;
}

a,
.router-link-active {
	text-decoration: none !important;
	color: #191970;
}

.v-enter,
.v-leave-to {
	opacity: 0;
	transform: translate3d(0, -30px, 0);
}

.v-enter-active,
.v-leave-active {
	transition: all 0.3s;
}

.slide-fade-enter-active {
	transition: all 0.3s ease;
}
.slide-fade-leave-active {
	transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateX(10px);
	opacity: 0;
}

main {
	display: flex !important;
}

#view-main {
	width: 100%;
	min-height: calc(100vh - 56px);
	background: #e9e9e9;
}

.view-title {
	font-size: 14px;
	text-transform: uppercase;
	padding: 10px;
	font-weight: bold;
}

.view-header {
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}

.btn-custom {
	margin: 4px;
	cursor: pointer;
	border: none;
	color: #fff;
	padding: 0px 10px;
	border-radius: 4px;
	transition: all 0.3s;
}

.btn-custom.expand {
	width: 100px;
	padding: 10px 15px;
}

.btn-custom.success {
	background: #328232;
}

.btn-custom.success:hover {
	background: #175017;
}

.btn-custom.danger {
	background: #ff3a3a;
}

.btn-custom.danger:hover {
	background: #d62828;
}

.btn-custom.info {
	background: #1919c7;
}

.btn-custom.info:hover {
	background: #191970;
}

.btn-custom.dark {
	background: #191c21;
}

.btn-custom.dark:hover {
	background: #000;
}

.btn-custom.grey {
	background: #666;
}

.btn-custom.grey:hover {
	background: #444;
}

.btn-incolor {
	background: transparent;
	color: #191970;
}

.btn-custom.success[disabled] {
	background: #093009 !important;
	color: #999;
	cursor: not-allowed;
}

.table thead th,
.table tbody tr {
	font-size: 12px;
	text-align: center;
}

.table tbody tr {
	cursor: pointer;
}

.table tbody tr:link,
.table tbody tr:active {
	outline: none !important;
}

.table th:focus,
.table tr:focus {
	outline: none !important;
}

.table thead th {
	text-transform: uppercase;
	color: #000;
	font-family: monospace;
	padding: 0;
	border: none;
	border-bottom: 2px solid #000 !important;
}

.table th,
.table td {
	vertical-align: middle !important;
}

button:focus {
	outline: none !important;
}

.custom-control-input:focus ~ .custom-control-label::before {
	box-shadow: none !important;
}

.dropdown-menu.show:focus {
	outline: none;
}

.dropdown-menu.show:after {
	content: "";
	height: 15px;
	width: 15px;
	background: inherit;
	position: absolute;
	top: -7.6px;
	right: 10px;
	transform: rotate(45deg);
	border-left: 1px solid rgba(0, 0, 0, 0.15);
	border-top: 1px solid rgba(0, 0, 0, 0.15);
}
.dropdown-menu.show:after {
	z-index: 10;
}
.dropdown-menu.show {
	z-index: 20;
}

/*VUE confirm*/
.dg-main-content {
	background: #191c21 !important;
	color: #abb;
	display: grid;
}

.dg-title {
	font-size: 24px !important;
	text-align: center;
}

.dg-content {
	text-align: center;
	font-size: 1rem !important;
}

.dg-view-wrapper {
	display: grid !important;
	grid-gap: 20px;
}

.dg-btn--ok,
.dg-btn--cancel {
	transition: all 0.3s;
	border: none !important;
	color: #fff !important;
	margin: 4px;
	padding: 10px 15px !important;
	width: 100px;
}

.dg-btn--ok {
	background: #328232 !important;
}

.dg-btn--ok:hover {
	background: #175017 !important;
}

.dg-btn--cancel {
	background: #666 !important;
}

.dg-btn--cancel:hover {
	background: #444 !important;
}

.dg-content-body {
	border: none !important;
}

.dg-content-footer {
	display: flex;
	align-items: flex-end;
	justify-content: center;
	grid-gap: 20px;
}

/**/
</style>
