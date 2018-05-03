<template>
	<div>
		<img v-bind:src="img" height="50" width="50">
		<h1>Milky</h1>
    	<router-view></router-view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				img: require('./assets/heart.jpg')
			}
		},
		created() {
			this.$http.get('/api/users').then((response) => {
				console.log(JSON.stringify(response.data, null, 4))
			}).catch((errorResponse) => {
				console.log(errorResponse)
			})
		}
	}
</script>

<style>
	@font-face {
	    font-family: maiden;
	    src: url('assets/fonts/maiden.ttf');
	}

	@font-face {
	    font-family: megadeth;
	    src: url('assets/fonts/megadeth.ttf');
	}

	h1 {
		font-family: megadeth;
	}

	body {
		font-family: megadeth;
	}
</style>