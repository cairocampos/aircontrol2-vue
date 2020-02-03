<template>
    <div class="login">
        <div id="box" v-if="preload == false">
            <form>
                <label for="username">Username</label>
                <input type="text" name="username" v-model="signIn.username" autofocus />
                <label for="password">Password</label>
                <input type="password" name="password" v-model="signIn.password" />
                <transition>
                    <button class="btn-login" @click.prevent="login">Entrar</button>
                </transition>
            </form>
            <ErrorNotification :errors="errors" />
        </div>
        <PreLoad v-else />
    </div>
</template>

<script>
import { api } from "@/services.js";
export default {
    name: "login",
    data() {
        return {
            errors: [],
            preload: false,
            signIn: {
                username: "",
                password: "",
                eulaAccepted: true
            }
        };
    },
    methods: {
        login() {
            this.errors = [];
            this.preload = true;

            api.post("/login", this.signIn)
                .then(response => {
                    this.preload = false;
                    if (response.status == 200) {
                        this.$store.commit("UPDATE_LOGIN", true);
                        this.$router.push("/");
                    }
                })
                .catch(() => {
                    this.preload = false;
                    this.errors.push("Dados inválidos!");
                });
        }
    }
};
</script>

<style>
.login {
    max-width: 500px;
    margin: 10% auto;
}

#box {
    background: #191c21;
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 0 4px solid rgba(0, 0, 0, 0.5);
}

form {
    display: grid;
}

input {
    height: 30px;
    border-radius: 4px;
    border: none;
    box-shadow: 0 0 2px 0 rgba(25, 25, 140, 0.5);
    padding-left: 8px;
    margin-bottom: 20px !important;
}

input:focus {
    outline: none;
    box-shadow: 0 0 0 1px rgba(25, 25, 140, 0.8);
}

.btn-login {
    border: none;
    background: #1919c7;
    color: #fff;
    font-weight: 700;
    border: 1px solid #191970;
    padding: 10px 0;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s;
    cursor: pointer;
    width: 250px;
    margin: auto;
}

.btn-login:hover {
    transform: scale(1.1);
}

label {
    color: #abb;
}
</style>
