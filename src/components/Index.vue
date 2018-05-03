<template>
	<div>
		<label>Username: </label>
		<input type="text" v-model="username">
		<label>Password: </label>
		<input type="password" v-model="password">
		<button>Login</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				username: null,
				password: null
			}
		},
		methods: {
			login() {
				console.log(this.username, this.password)
			}
		},
		created() {

		}
	}
</script>