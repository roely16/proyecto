<template>
	<div>
		<b-container>
			<b-list-group>
				<b-list-group-item style="margin-top:25px;" v-for="{ name, id, icono, zonas, porcentaje } in this.items_logitica" :key="id" class="card_menu">

					<b-row style="margin-bottom: 25px;">
						<b-col>
							<h4 class="text-center">{{ name }}</h4>
						</b-col>
					</b-row>
					<b-row style="margin-bottom: 25px;" align-v="center">
						<b-col >
							<b-img left v-bind:src="icono" width="70%" alt="Left image"></b-img>
						</b-col>
						<b-col>
							<h1 style="font-size: 4em" class="text-right">{{ porcentaje }}%</h1>
						</b-col>
					</b-row>

					<b-row>
						<b-col>
							
							<b-button v-on:click="mostrarDetalles(id)" class="text-center" variant="outline-secondary" size="sm">Detalles</b-button>

							<b-collapse v-bind:id="id" class="mt-2">
								<b-table dark striped hover :items="zonas" :fields="titulos" selectable select-mode="single" selectedVariant="success" @row-selected="rowSelected">
									<template slot="zonas" slot-scope="data">
										<h5>{{ data.item.zona }}</h5>
									</template>
									<template slot="total" slot-scope="data">
										<h5 class="text-right">{{ data.item.total_finalizados }} / {{ data.item.total }}</h5>
									</template>
								</b-table>
							</b-collapse>

						</b-col>
					</b-row>

				</b-list-group-item>
			</b-list-group>

		</b-container>
		
		<b-modal ok-only ref="modal-detalles" :title="this.titulo_modal">
    		<b-table striped dark :items="this.centros_zona">
				<template slot="estado" slot-scope="data">
					<b-img v-if="data.item.estado == 'S'" center src="./check.png" width="20%" alt="Left image"></b-img>
					<b-img v-if="data.item.estado == 'N'" center src="./cross.png" width="20%" alt="Left image"></b-img>
				</template>
			</b-table>
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

		data() {

			return {
				persona: JSON.parse(localStorage.getItem('datos_persona')), 
				items_logitica: [],
				titulos: [],
				selected: [],
				centros_zona: [],
				titulo_modal: ''
			}
		},
		methods: {

			getData: function(){

				var self = this

				let data = {
					"id_region" : this.persona.id_region
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/logistica_region',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.items_logitica = response.data.data.datos_tabla
					self.titulos = response.data.data.titulos_tabla

					console.log(response.data)

				})
				.catch(function (error){

					alert(error)
					self.isLoading = false

				})

			},
			mostrarDetalles: function(id){

				this.$root.$emit('bv::toggle::collapse', id)

			},
			getDetails: function(){

				var self = this

				let data = {
					"zona" : this.selected[0].zona,
					"region": this.persona.id_region,
					"campo": this.selected[0].campo
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/logistica_detalles_zona',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.titulo_modal = "Zona " + self.selected[0].zona
					self.centros_zona = response.data
					self.$refs['modal-detalles'].show()

				})
				.catch(function (error){

					alert(error)

				})

			},
			rowSelected(items) {

				this.selected = items

				if (this.selected.length > 0) {

					this.getDetails()

				}

			}

		},
		mounted(){

			this.getData()

		}

	}
	
</script>