<template>
	<div>
		<b-container class="bv-example-row">

		<b-row >
			<b-col>
				<b-card  class="center-card">

					<p class="h4 text-center mb-4">Sistema de Monitoreo y Control</p>

					<p class="h4 text-center mb-4">Iniciar Sesion</p>

					<b-form @submit="onSubmit" @reset="onReset" v-if="show">

						<b-form-group
							id="input-group-1"
							label="Usuario:"
							label-for="input-1"
						>
							<b-form-input
							id="input-1"
							v-model="form.user"
							size="lg"
							type="text"
							required
							placeholder="Ingrese su usuario"
							></b-form-input>
						</b-form-group>

						<b-row>

							<b-col cols="6">
								<b-button type="submit" size="lg" variant="primary">Ingresar</b-button>
							</b-col>

							<b-col cols="6" v-if="isLoggin">
								<div class="d-flex align-items-center">
									<strong>Iniciando sesion...</strong>
									<b-spinner class="ml-auto"></b-spinner>
								</div>
							</b-col>
						</b-row>

						<br>
						<b-row>
							<b-col>
								<div>
									<b-alert v-model="errorLogin" variant="danger" dismissible>
										Usuario Incorrecto!
									</b-alert>
								</div>
							</b-col>
						</b-row>

					</b-form>
				</b-card>
			</b-col>
		</b-row>

		</b-container>
	</div>
</template>

<style scoped>

  	.center-card{
		border-radius: 1rem;
		border-width: 1rem;
		margin-top: 10rem
  	}
	  

</style>

<script>

	import axios from 'axios';

	export default {
		data() {
			return {
				form: {
					user: '',					
				},
				show: true,
				errorLogin: false,
				isLoggin: false,
				isError: false
			}
		},
		methods: {

			onSubmit(evt) {

				evt.preventDefault()

				var self = this
				self.isLoggin = true

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/login',
					headers: {
						'content-type': 'application/json'
					},
					data: this.form

				})
				.then(function (response){

					console.log(response.data)

					if (response.data.code == 100) {
						
						//console.log('Login exitoso')
						self.errorLogin = true

					}else{

						localStorage.setItem('datos_persona', JSON.stringify(response.data.data[0]))
						localStorage.setItem('auth', true)
						self.$router.push('home')
						self.$emit("authenticated", true)

					}

					self.isLoggin = false

				})
				.catch(function (error){

					alert(error)

					self.isLoggin = false

				})

			},
			onReset(evt) {
				evt.preventDefault()
				// Reset our form values
				this.form.user = ''
				this.form.pass = ''
				this.show = false
				this.$nextTick(() => {
				this.show = true
				})
			}
		}
	}

</script>