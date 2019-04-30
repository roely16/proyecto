<template>
    <div>
        <b-container>
			<div v-if="!this.isLoading">
				<b-list-group>
					<b-list-group-item  class="card_menu" button v-for="{ name, id, icono, estado, campo } in this.items_logitica" :key="id" v-on:click="cambiarEstado(estado, campo)">

						<b-row align-v="center">
							<b-col cols="2">
								<b-img left v-bind:src="icono" width="50%" alt="Left image"></b-img>
							</b-col>
							<b-col cols="8">
								<h5>{{ name }}</h5>
							</b-col>
							<b-col cols="1">

								<b-img v-if="estado == 'N'" left src="./cross.png" width="20%" alt="Left image"></b-img>
								<b-img v-if="estado == 'S'" left src="./check.png" width="20%" alt="Left image"></b-img>
								
							</b-col>
						</b-row>
					</b-list-group-item>
				</b-list-group>
			</div>

			<div v-else class="text-center" style="margin-top: 10px;">
				<b-spinner variant="primary" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
			</div>

        </b-container>
    </div>
</template>

<style scoped>
	h1 {
		color: green
	}
</style>

<style scoped>
  
	.card_menu{
		margin-top: 10px;
  	};

</style>

<script>

		import axios from 'axios';
		
    export default {

		data() {

			return {
				persona: JSON.parse(localStorage.getItem('datos_persona')),
				items_logitica: '',
				isLoading: false
			}

		},
		methods: {

			getData: function(reloadAnimation){

				this.isLoading = reloadAnimation

				var self = this

				let data = {
					"id_persona" : this.persona.id_persona
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/obtener_lista_logistica',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.items_logitica = response.data.data
					self.isLoading = false

				})
				.catch(function (error){

					alert(error)
					self.isLoading = false

				})

			},
			cambiarEstado: function(estado, campo){

				var self = this

				var centro_votacion = JSON.parse(localStorage.getItem('centro_votacion'))

				if (estado == "S") {
					
					estado = "N"

				}else{

					estado = "S"

				}

				let data = {
					"id_centro" : centro_votacion.id_centro,
					"estado": estado,
					"campo": campo
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/cambiar_estado_logistica',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.getData(false)

					self.$toasted.show('Registro actualizado', {
						duration: 2000,
						position: 'bottom-center',
						icon: 'check'					
					})

				})
				.catch(function (error){

					alert(error)

				})

			}

		},
		mounted(){

			this.getData(true)

		}

  }
</script>