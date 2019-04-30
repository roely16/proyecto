<template>
	<div>
		<b-container style="margin-top: 25px;">
			<b-tabs content-class="mt-3">
				<b-tab title="Pendientes de Asignar" active>

					<div v-if="this.pendientes.length > 0">
						<b-table id="tabla-pendientes"  striped dark :items="this.pendientes" :fields="this.titulos" selectable select-mode="single" selectedVariant="success" @row-selected="rowSelected" :per-page="perPageTab1" :current-page="currentPageTab1"></b-table>

						<b-pagination
							v-model="currentPageTab1"
							:total-rows="rowsTab1"
							:per-page="perPageTab1"
							aria-controls="tabla-pendientes"
							align="fill"
						>
						</b-pagination>
					</div>

					<h5 v-else class="text-center">-- No se encontraron registros --</h5>

				</b-tab>
				<b-tab title="Asignadas">

					<div v-if="this.asignadas.length > 0">
						<b-table id="tabla-asignadas" striped dark :items="this.asignadas" :fields="this.titulos" selectable select-mode="single" @row-selected="rowSelected" :per-page="perPageTab2" :current-page="currentPageTab2"></b-table>

						<b-pagination
							v-model="currentPageTab2"
							:total-rows="rowsTab2"
							:per-page="perPageTab2"
							aria-controls="tabla-asignadas"
							align="fill"
						>
						</b-pagination>
					</div>

					<h5 v-else class="text-center">-- No se encontraron registros --</h5>

				</b-tab>
			</b-tabs>
		</b-container>

		<b-modal ok-only ref="modal-detalles" title="Detalle de Incidencia">

			<b-form @submit="asignarResponsable">
				<b-form-group
					label="Responsable"
				>
					<b-form-select v-model="detalle_incidencia.id_responsable" :options="contactos" required></b-form-select>
				</b-form-group>

				<b-row style="margin-bottom: 10px;">
					<b-col class="text-center">
						<b-button type="submit" variant="success">Asignar Resposable</b-button>
					</b-col>
				</b-row>
			</b-form>

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

			<!-- <b-form-group
				label="Responsable"
			>
				<b-form-input v-model="detalle_incidencia.responsable" readonly></b-form-input>
			</b-form-group> -->
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
				asignadas: [],
				pendientes: [],
				detalle_incidencia: {},
				titulos: [],
				contactos: [],
				perPageTab1: 7,
				currentPageTab1: 1,
				perPageTab2: 7,
				currentPageTab2: 1,
			}

		},
		methods: {

			getData: function(){

				var self = this

				let data = {
					"region" : this.$route.params.region,
					"zona": this.$route.params.zona
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/incidencias_pendientes_zona',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.asignadas = response.data.data.pendientes_asignadas
					self.pendientes = response.data.data.pendientes_sin_asignar
					self.titulos = response.data.data.titulos

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
					self.getContactos()

				})
				.catch(function (error){

					alert(error)

				})

			},
			getContactos: function(){

				var self = this

				let data = {
					"zona" : this.$route.params.zona
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/contactos_logistica',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					console.log(response.data)
					self.contactos = response.data
					self.$refs['modal-detalles'].show()

				})
				.catch(function (error){

					alert(error)

				})

			},
			asignarResponsable: function(evt){

				evt.preventDefault()

				var self = this
				
				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/asignar_responsable',
					headers: {
						'content-type': 'application/json'
					},
					data: self.detalle_incidencia

				})
				.then(function (response){

					self.$refs['modal-detalles'].hide()

					self.$toasted.show('Responsable actualizado', {
						duration: 2000,
						position: 'bottom-center',
						icon: 'check'					
					})

					self.getData()

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

		},
		computed: {
			rowsTab1(){
				return this.pendientes.length
			},
			rowsTab2(){
				return this.asignadas.length
			}
		}

	}

</script>