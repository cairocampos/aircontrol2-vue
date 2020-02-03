import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "/api/v1",
	headers: {
		"Content-Type": "application/json"
	},
	withCredentials: true
});

export const api = {
	get(endpoint) {
		return axiosInstance.get(endpoint);
	},
	post(endpoint, body) {
		return axiosInstance.post(endpoint, body);
	},
	delete(endpoint, body) {
		return axiosInstance.delete(endpoint, body);
	},
	patch(endpoint, body) {
		return axiosInstance.patch(endpoint, body);
	},
	put(endpoint, body) {
		return axiosInstance.put(endpoint, body);
	}
};
