<template>

  	<div>

		<div>

			<b-container>

					<div v-if="!this.isLoading">
						<b-card class="card_menu" v-for="{ descripcion, id_menu, icono, componente } in this.datos_menu" :key="id_menu">

						<b-link v-bind:href="componente">
							<b-row align-v="center">
								<b-col cols="3">
									<div class="clearfix">
										<b-img left v-bind:src="icono" width="60%" alt="Left image"></b-img>
									</div>
								</b-col>
								<b-col>
									<h5 class="texto">{{ descripcion }}</h5>
								</b-col>
							</b-row>
						</b-link>
					</b-card>
					</div>

					<div v-else class="text-center" style="margin-top: 10px;">
						<b-spinner variant="primary" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
					</div>
					

			</b-container>
		
		</div>

  	</div>

  
</template>

<style scoped>
  
	.card_menu{
		border-radius: 25px;
		border-width: 5px;
		margin-top: 10px;
		/* background-color: black */
  	};

</style>

<style scoped>
	/* .texto{
		color: white
	} */
	.link{
		color: inherit;
	}
</style>


<script>

	import axios from 'axios';

	export default {
		
		data() {

			return {
				persona: JSON.parse(localStorage.getItem('datos_persona')),
				datos_menu: '',
				centro_votacion: '',
				getMenu: false,
				isLoading: false
			}

		},
		methods: {

			getData: function(){

				this.isLoading = true

				var self = this

				let data = {
					"id_perfil" : this.persona.id_perfil,
					"id_persona" : this.persona.id_persona
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/obtener_menu',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.datos_menu = response.data.data.menu
					self.getMenu = true
					self.centro_votacion = response.data.data.centro_votacion[0]
					
					if (response.data.data.centro_votacion[0]) {

						console.log('tiene centro')
						localStorage.setItem('centro_votacion', JSON.stringify(response.data.data.centro_votacion[0]))
						localStorage.setItem('is_centro', true)
						self.$emit("centro", true)

					}else{

						console.log('no tiene centro')

					}

					self.isLoading = false

				})
				.catch(function (error){

					alert(error)
					self.isLoading = false

				})

			}

		},
		mounted(){

			this.getData()

		}

	}
</script>
