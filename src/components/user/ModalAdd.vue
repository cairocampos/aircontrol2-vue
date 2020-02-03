<template>
    <div v-if="modalAddState">
        <ModalDefault :title="title">
            <template v-slot:modalClose>
                <button class="md-close" @click="closeModal">&times;</button>
            </template>
            <template v-slot:modalBody>
                <form>
                    <div class="group">
                        <div class="group--info">
                            <div class="form_type">Perfil</div>
                            <label for="role">Função</label>
                            <select name="role" id="role" v-model="role">
                                <option disabled value>Selecione uma função</option>
                                <option
                                    v-for="role in $store.state.allRoles"
                                    :value="role.id"
                                    :key="role.id"
                                >{{role.name}}</option>
                            </select>

                            <label for="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                v-model="user.username"
                            />

                            <label for="first_name">Nome</label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                v-model="user.firstName"
                            />

                            <label for="las_name">Sobrenome</label>
                            <input
                                type="text"
                                name="las_name"
                                id="last_name"
                                v-model="user.lastName"
                            />

                            <label for="email">Email</label>
                            <input type="text" name="email" id="email" v-model="user.email" />
                        </div>
                        <div class="group--security">
                            <div class="form_type">Segurança</div>
                            <label for="password">Senha</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                v-model="user.password"
                            />

                            <label for="confirmPassword">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                v-model="user.confirmPassword"
                            />

                            <div v-if="showValidationPass">
                                <div class="form_type my-2">Sua senha deve conter</div>
                                <ul>
                                    <li>O tamanho mínimo da senha é de 8 caracteres</li>
                                    <li>Deve conter uma letra maiúscula [A-Z]</li>
                                    <li>Deve conter uma letra minúscula [a-z]</li>
                                    <li>Deve conter um dígito [0-9]</li>
                                    <li>Deve conter caracteres especiais Ou use uma senha de mais de 20 caracteres (mas não permita mais de 2 caracteres repetidos)</li>
                                    <li>Apenas símbolos ASCII são permitidos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="form-footer d-flex justify-content-end">
                        <button type="button" class="btn-custom danger" @click="closeModal">Fechar</button>
                        <button
                            type="submit"
                            class="btn-custom success"
                            @click.prevent="createUser"
                        >Criar</button>
                    </div>

                    <ErrorNotification :errors="errors" />
                </form>
            </template>
        </ModalDefault>
    </div>
</template>

<script>
import ModalDefault from "@/components/geral/ModalDefault.vue";
import { api } from "@/services.js";

export default {
    name: "ModalInfo",
    props: ["modalAddState"],
    components: {
        ModalDefault
    },
    data() {
        return {
            errors: [],
            title: "Adicionar Usuário",
            user: {
                username: "",
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: ""
            },
            role: "",
            showValidationPass: false
        };
    },
    methods: {
        closeModal() {
            this.$emit("update:modalAddState", false);
            this.role = "";
            this.user = {
                username: "",
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: ""
            };
        },
        async getPermission(id) {
            let data = {};
            await api.get(`/roles/${id}`).then(response => {
                data["role"] = response.data;
            });
            return data;
        },
        async createUser() {
            await this.getPermission(this.role);
            let obj = {};
            obj = await this.getPermission(this.role);
            let dados = await Object.assign(obj, this.user);
            let res = {};
            this.errors = [];

            let fieldsRequireds = ["username", "password", "confirmPassword"];
            let fieldsEmpty = [];
            let regex = /^(?=(?:.*?[A-Z]){1})(?=(?:.*?[0-9]){1})(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%;*(){}_+^&]*$/;

            Object.entries(this.user).filter(item => {
                for (let i = 0; i < fieldsRequireds.length; i++) {
                    if (item[0] == fieldsRequireds[i] && item[1] == "") {
                        fieldsEmpty.push(item[0]);
                    }
                }
            });

            if (fieldsEmpty.length > 0) {
                if (!this.role) {
                    this.errors.push("<strong>função</strong> é obrigatório!");
                }

                for (let i = 0; i < fieldsEmpty.length; i++) {
                    this.errors.push(
                        `<strong>${fieldsEmpty[i]}</strong> é obrigatório!`
                    );
                }
            } else if (!regex.exec(this.user.password)) {
                this.showValidationPass = true;
            } else if (this.user.password != this.user.confirmPassword) {
                this.errors.push("Senhas não correspondem!");
            } else {
                api.post("/users", dados)
                    .then(response => {
                        let status = response.status;

                        if (
                            Object.keys(response.data).length > 0 &&
                            status === 201
                        ) {
                            this.closeModal();
                            this.$emit("updateTable");
                            res = {
                                title: "Sucesso",
                                msg: "Usuário criado com sucesso!",
                                type: "success"
                            };
                            this.$store.dispatch("updateResponseRequest", res);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    }
};
</script>

<style scoped>
form .group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: auto;
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

ul li {
    margin: 0;
    padding: 0;
    font-size: 12px;
    list-style-type: disc;
}
</style>
