export default {
	methods: {
		confirmAction(msg) {
			return this.$dialog
				.confirm(msg)
				.then(() => {
					return true;
				})
				.catch(() => {
					return false;
				});
		}
	}
};
