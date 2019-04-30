<template>
	<div>
		<b-container>

			<div v-if="!this.isLoading">
				<b-table style="margin-top: 10px;" dark striped :items="this.mesas" :fields="this.titulos">
					<template slot="id_mesa" slot-scope="data">
						<b-row>
							<b-col>
								<b-button v-on:click="modalIngreso(data.value)" variant="primary" size="lg" v-b-modal.modal-ingreso>{{ data.value }}</b-button>
							</b-col>
							<b-col>
								<b-img v-if="data.item.tendencia == 'S'" left src="./warning_sign.png" width="50%" alt="Left image"></b-img>
							</b-col>
						</b-row>
					</template>
					<template slot="p" slot-scope="data">
						<b-img v-if="data.item.presidente" left src="./check.png" width="20%" alt="Left image"></b-img>
						<b-img v-if="!data.item.presidente" left src="./cross.png" width="20%" alt="Left image"></b-img>
					</template>
					<template slot="a" slot-scope="data">
						<b-img v-if="data.item.alcalde" left src="./check.png" width="20%" alt="Left image"></b-img>
						<b-img v-if="!data.item.alcalde" left src="./cross.png" width="20%" alt="Left image"></b-img>
					</template>
				</b-table>
			</div>

			<div v-else class="text-center" style="margin-top: 10px;">
				<b-spinner variant="primary" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
			</div>
			
		</b-container>

		<b-modal hide-footer id="modal-ingreso" title="Ingreso de Resultados">
			<b-tabs v-model="tabIndex">
				<b-tab title="Presidente" active>
					
					<br>
					
					<b-form  @submit="registrarPresidente">
						<b-row align-h="center" v-for="partido in this.partidos_presidente" :key="partido.id_partido">
							<b-col>
								<b-form-group
									:label="partido.nombre"
									label-size="lg"
								>

									<b-form-input autocomplete="off" required v-model="partido.total_votos" type="number" cols="2" size="lg">

									</b-form-input>
								</b-form-group>
							</b-col>
						</b-row>

						<b-row align-h="center" >
							<b-col>
								<b-form-group
									label="Total"
									label-size="lg"
								>

									<b-form-input readonly required v-model="calcularTotal" type="text" cols="2" size="lg">

									</b-form-input>
								</b-form-group>
							</b-col>
						</b-row>
						<b-button type="submit" variant="primary" size="lg">Grabar</b-button>
					</b-form>
				</b-tab>
				<b-tab title="Alcalde">
					<br>

					<b-form  @submit="registrarAlcalde">

						<b-row align-h="center" v-for="partido in this.partidos_alcalde" :key="partido.id_partido">
							<b-col>
								<b-form-group
									:label="partido.nombre"
									label-size="lg"
								>

									<b-form-input autocomplete="off" required v-model="partido.total_votos" type="number" cols="2" size="lg">

									</b-form-input>
								</b-form-group>
							</b-col>
						</b-row>

						<b-row align-h="center" >
							<b-col>
								<b-form-group
									label="Total"
									label-size="lg"
								>

									<b-form-input readonly required v-model="calcularTotalA" type="text" cols="2" size="lg">

									</b-form-input>
								</b-form-group>
							</b-col>
						</b-row>

						<b-button type="submit" variant="primary" size="lg">Grabar</b-button>

					</b-form>
				</b-tab>
			</b-tabs>
		</b-modal>

	</div>
</template>

<style scoped>
	h1 {
		color: green
	}	
</style>

<script>

	import axios from 'axios';

	export default {

		data(){

			return{
				mesas: [],
				titulos: [],
				partidos_presidente: [],
				partidos_alcalde: [],
				mesa: '',
				total_presidente: '',
				total_alcalde: '',
				tabIndex: 0,
				isLoading: false
			}

		},
		methods: {

			getData: function(reloadAnimation){

				this.isLoading = reloadAnimation

				var self = this

				var centro_votacion = JSON.parse(localStorage.getItem('centro_votacion'))

				let data = {
					"id_centro" : centro_votacion.id_centro
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/obtener_mesas',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.mesas = response.data.data.mesas
					self.titulos = response.data.data.titulos
					self.isLoading  = false

				})
				.catch(function (error){

					alert(error)
					self.isLoading = false

				})

			},
			modalIngreso: function(id_mesa){

				var self = this

				var centro_votacion = JSON.parse(localStorage.getItem('centro_votacion'))
				
				this.mesa = id_mesa
				this.tabIndex = 0

				let data = {
					"id_centro" : centro_votacion.id_centro,
					"id_mesa": id_mesa
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/partidos_ingreso',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.partidos_presidente = response.data.data.presidente
					self.partidos_alcalde = response.data.data.alcalde

				})
				.catch(function (error){

					alert(error)

				})

			},
			registrarPresidente: function(evt){

				evt.preventDefault()

				var self = this

				var centro_votacion = JSON.parse(localStorage.getItem('centro_votacion'))
				
				let data = {
					"id_centro" : centro_votacion.id_centro,
					"id_mesa": this.mesa,
					"partidos": this.partidos_presidente
				}
				
				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/registrar_resultados',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.getData(false)

					self.$toasted.show('Datos registrados', {
						duration: 2000,
						position: 'bottom-center',
						icon: 'check',
						theme: 'outline'
					})

				})
				.catch(function (error){

					alert(error)

				})

			},
			registrarAlcalde: function(evt){

				evt.preventDefault()

				var self = this

				var centro_votacion = JSON.parse(localStorage.getItem('centro_votacion'))
				
				let data = {
					"id_centro" : centro_votacion.id_centro,
					"id_mesa": this.mesa,
					"partidos": this.partidos_alcalde
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/registrar_resultados',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.getData(false)

					self.$toasted.show('Datos registrados', {
						duration: 2000,
						position: 'bottom-center',
						icon: 'check',
						theme: 'outline'
					})

				})
				.catch(function (error){

					alert(error)

				})

			}

		},
		mounted(){

			this.getData(true)

			this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
				console.log('Modal cerrado')
			})

		},
		computed: {
			calcularTotal(){

				let total = 0

				this.partidos_presidente.forEach(partido => {
					
					if (partido.total_votos) {
						
						total = total + parseInt(partido.total_votos)
					}

				});

				return total
			},
			calcularTotalA(){

				let total = 0

				this.partidos_alcalde.forEach(partido => {
					
					if (partido.total_votos) {
						
						total = total + parseInt(partido.total_votos)
					}

				});

				return total

			}
		}
		
	}

</script>