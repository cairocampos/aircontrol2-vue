/*
* @Mixins closeModal
*/

export default {
    props: ["modalInfoState"],
    methods: {
        closeModal() {
            this.$emit("update:modalInfoState", false);
        }
    },
}