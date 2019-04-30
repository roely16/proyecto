<template>
	<div>

		<b-container>
			<b-table id="tabla-pendientes" striped dark :items="this.pendientes" :fields="this.titulos" selectable select-mode="single" selectedVariant="success" :per-page="perPage" :current-page="currentPage" @row-selected="rowSelected" caption-top>
				<template slot="table-caption">Impugnaciones Pendientes</template>
			</b-table>
			<b-pagination
				v-model="currentPage"
				:total-rows="rows"
				:per-page="perPage"
				aria-controls="tabla-pendientes"
				align="fill"
			>
			</b-pagination>
		</b-container>

		<b-modal ok-only ref="modal-detalles" title="Detalles de Impugnación">
			
			<b-form-group
				label="Tipo de Incidencia"
			>
				<b-form-input v-model="detalle_incidencia.tipo_incidencia" readonly></b-form-input>
			</b-form-group>

			<b-form-group
				label="Título"
			>
				<b-form-textarea rows="3" v-model="detalle_incidencia.titulo" readonly></b-form-textarea>
			</b-form-group>

			<b-form-group
				label="Descripción"
			>
				<b-form-textarea rows="3" v-model="detalle_incidencia.descripcion" readonly></b-form-textarea>
			</b-form-group>

			<b-form-group
				label="Centro"
			>
				<b-form-textarea rows="3" v-model="detalle_incidencia.centro" readonly></b-form-textarea>
			</b-form-group>
			
			<b-form-group
				label="Fecha y Hora"
			>
				<b-form-input v-model="detalle_incidencia.fecha" readonly></b-form-input>
			</b-form-group>

		</b-modal>

	</div>
</template>

<style scoped>
	
</style>

<script>

	import axios from 'axios';

	export default {

		data(){
			return{

				pendientes: [],
				perPage: 7,
				currentPage: 1,
				selected: [],
				titulos: [],
				detalle_incidencia: {}

			}
		},
		methods: {

			getData: function(){

				var self = this

				let data = {
					"zona": this.$route.params.zona
				}

				axios({

					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/impugnaciones_pendientes',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.titulos = response.data.data.titulos
					self.pendientes = response.data.data.datos_tabla
					console.log(response.data)

				})
				.catch(function (error){

					alert(error)

				})

			},
			getDetails: function(){

				var self = this

				let data = {
					"id_incidencia" : this.selected[0].id_incidencia
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/detalles_incidencia_finalizada',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.detalle_incidencia = response.data.data.detalles[0]
					self.$refs['modal-detalles'].show()
					console.log(response.data)

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

			},

		},
		mounted(){

			this.getData()

		},
		computed: {
			rows(){
				return this.pendientes.length
			}
		}

	}

</script>