<template>
    <div v-if="modalInfoState">
        <ModalDefault :title="title">
            <template v-slot:modalClose>
                <button class="md-close" @click="closeModal">&times;</button>
            </template>
            <template v-slot:modalBody>
                <div v-if="userInfo">
                    <form>
                        <div class="group">
                            <div class="group--info">
                                <div class="form_type">Perfil</div>
                                <div v-if="$store.getters.userRole == 'Administrator'">
                                    <label>Função</label>
                                    <select v-model="role">
                                        <option
                                            v-for="(item, index) in $store.state.allRoles"
                                            :key="index"
                                            :value="item.id"
                                        >{{item.name}}</option>
                                    </select>
                                </div>
                                <label for="username">Username</label>
                                <input type="text" name="username" id="username" v-model="username" />

                                <label for="first_name">Nome</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    v-model="firstName"
                                />

                                <label for="last_name">Sobrenome</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    v-model="lastName"
                                />

                                <label for="email">Email</label>
                                <input type="text" name="email" id="email" v-model="email" />
                            </div>
                            <div class="group--security">
                                <div class="form_type">Segurança</div>
                                <div v-if="$store.state.sessionUser.id == userInfo.id">
                                    <label for="currentPassword">Senha Atual</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        id="currentPassword"
                                        v-model="currentPassword"
                                    />
                                </div>

                                <label for="password">Nova Senha</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    v-model="password"
                                />

                                <label for="confirmPassword">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    v-model="confirmPassword"
                                />
                            </div>
                        </div>
                        <ErrorNotification :errors="errors" />
                        <div class="form-footer d-flex justify-content-end">
                            <button
                                type="button"
                                class="btn-custom danger"
                                @click="closeModal"
                            >Fechar</button>
                            <button
                                type="submit"
                                class="btn-custom success"
                                @click.prevent="updateUser"
                            >Salvar</button>
                        </div>
                    </form>
                </div>
                <PreLoad v-else />
            </template>
        </ModalDefault>
    </div>
</template>

<script>
import ModalDefault from "@/components/geral/ModalDefault.vue";
import closeModal from "@/mixins/closeModal.js";
import { mapGetters } from "vuex";
import { api } from "@/services.js";

export default {
    name: "ModalInfo",
    props: ["modalInfoState", "userInfo"],
    mixins: [closeModal],
    components: {
        ModalDefault
    },
    computed: {
        ...mapGetters(["getRole"]),
        username: {
            get() {
                return this.$store.state.user.username;
            },
            set(value) {
                this.$store.commit("UPDATE_USER", { username: value });
            }
        },
        firstName: {
            get() {
                return this.$store.state.user.firstName;
            },
            set(value) {
                this.$store.commit("UPDATE_USER", { firstName: value });
            }
        },
        lastName: {
            get() {
                return this.$store.state.user.lastName;
            },
            set(value) {
                this.$store.commit("UPDATE_USER", { lastName: value });
            }
        },
        email: {
            get() {
                return this.$store.state.user.email;
            },
            set(value) {
                this.$store.commit("UPDATE_USER", { email: value });
            }
        },
        role: {
            get() {
                return this.$store.state.user.role.id;
            },
            set(value) {
                let data = this.getRole(value);
                this.$store.commit("UPDATE_USER", { role: data });
            }
        }
    },
    data() {
        return {
            errors: [],
            title: "Informações",
            currentPassword: "",
            password: "",
            confirmPassword: ""
        };
    },
    methods: {
        updateUser() {
            this.errors = [];
            let obj = this.$store.state.user;
            delete obj.currentPassword;
            delete obj.password;
            delete obj.confirmPassword;

            if (this.password) {
                if (this.password === this.confirmPassword) {
                    obj = Object.assign(obj, {
                        currentPassword: this.currentPassword,
                        password: this.password,
                        confirmPassword: this.confirmPassword
                    });
                } else {
                    this.errors.push("Senhas não correspondem!");
                    return;
                }

                if (!this.currentPassword) {
                    this.errors.push(
                        "É necessário informar a <b>senha atual</b>!"
                    );
                    return;
                }
            }

            api.patch(`/users/${obj.id}`, JSON.stringify(obj)).then(
                response => {
                    if (
                        response.status === 200 &&
                        Object.keys(response.data).length > 0
                    ) {
                        this.$emit("updateTable");
                        let res = {
                            title: "Sucesso",
                            msg: `Usuário <strong>${obj.username}</strong> atualizado com sucesso!`,
                            type: "success"
                        };
                        this.$store.dispatch("updateResponseRequest", res);
                        this.closeModal();
                        this.currentPassword = "";
                        this.password = "";
                        this.confirmPassword = "";
                    }
                }
            );
        }
    },
    watch: {
        userInfo() {
            let obj = {};
            let {
                id,
                username,
                firstName,
                lastName,
                email,
                role
            } = this.userInfo;
            obj = {
                id: id,
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role,
                sessionTimeout: 15
            };
            this.$store.commit("UPDATE_USER", obj);
        }
    }
};
</script>

<style scoped>
form .group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
}

label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin: 10px 0 0 0;
    color: #191c21;
}

select {
    background: #fff;
    border: none;
    font-size: 14px;
    box-shadow: 0 0 2px 0 rgba(25, 25, 140, 0.5);
    cursor: pointer;
    border-radius: 4px;
}

select:focus {
    outline: none;
}

input,
select {
    height: 25px;
    padding: 0 5px;
    box-sizing: border-box;
    margin: 0 !important;
    width: 100%;
}

input:focus {
    outline: none;
    border: 1px solid #191c21;
}

.form_type {
    font-weight: lighter;
    border-bottom: 1px solid #6c757d;
}

.form-footer {
    margin: 10px 0;
}
</style>
