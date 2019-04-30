<template>
	<div>
		<b-container>

			<div v-if="!this.isLoading">

				<b-button v-b-modal.modal-nueva style="margin-top: 10px;" variant="success" size="lg">
					Nueva
				</b-button>

				<b-table selectable select-mode="single" :per-page="perPage" :current-page="currentPage" id="tabla-incidentes" class="tabla" dark striped :items="this.incidentes" :fields="this.titulos" @row-selected="rowSelected">
					<template slot="estatus" slot-scope="data">
						<b-img v-if="data.value == 'F'" center src="./check.png" width="20%" alt="Left image"></b-img>
						<b-img v-if="data.value == 'P'" center src="./pending.png" width="20%" alt="Left image"></b-img>
					</template>
				</b-table>

				<b-pagination
					v-model="currentPage"
					:total-rows="rows"
					:per-page="perPage"
					aria-controls="tabla-incidentes"
					align="fill"
				>
				</b-pagination>

			</div>

			<div v-else class="text-center" style="margin-top: 10px;">
				<b-spinner variant="primary" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
			</div>

		</b-container>

		<b-modal ref="modal-grabar" hide-footer id="modal-nueva" title="Nueva Incidencia">

			<b-form @submit="registrarIncidente" @reset="onReset" >

				<b-form-group
					label="Tipo de Incidencia"
				>
					<b-form-select
						:options="tipos_incidencia"
						v-model="tipo"
						required
						size="lg"
					></b-form-select>

				</b-form-group>

				<b-form-group
					label="Título"
				>
					<b-form-input
						type="text"
						v-model="titulo"
						required
						size="lg"
					></b-form-input>
				</b-form-group>

				<b-form-group
					label="Descripción"
				>
					<b-form-textarea
						rows="3"
						required
						v-model="descripcion"
						size="lg"
					></b-form-textarea>
				</b-form-group>

				<b-button type="reset" size="lg">Cancelar</b-button>
				<b-button type="submit" variant="primary" size="lg">Grabar</b-button>

			</b-form>

		</b-modal>
		
		<b-modal ok-only ref="modal-detalles" title="Detalles de Incidencia">
			<b-form @submit="cambiarEstado">
				<b-form-group
					label="Estado"
				>
					<b-form-select v-model="detalle_incidencia.estatus" :options="estados" required></b-form-select>
				</b-form-group>

				<b-row style="margin-bottom: 10px;">
					<b-col class="text-center">
						<b-button type="submit" variant="success">Actualizar Estado</b-button>
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

			<b-form-group
				label="Responsable"
			>
				<b-form-input v-model="detalle_incidencia.responsable" readonly></b-form-input>
			</b-form-group>
  		</b-modal>
	</div>
</template>

<style scoped>
	.tabla{
		margin-top: 10px;
  	};
</style>

<script>

	import axios from 'axios';

	export default {

		data(){

			return{
				incidentes: [],
				titulos: [],
				perPage: 7,
				currentPage: 1,
				tipos_incidencia: [
					{ value: null, text: 'Seleccione una opción' },
					{ value: 1, text: 'Logística' },
					{ value: 2, text: 'Jurírica' },
					{ value: 3, text: 'Impugnación' }
				],
				tipo: null,
				titulo: '',
				descripcion: '',
				isLoading: false,
				selected: [],
				detalle_incidencia: {},
				estados: [
					{ value: null, text: 'Seleccion una opción' },
					{ value: 'P', text: 'Pendiente' },
					{ value: 'F', text: 'Finalizada' }
				]
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
					url: 'https://project2019.club/api_proyectojunio/public/incidencias_centro',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.incidentes = response.data.data.datos_tabla
					self.titulos = response.data.data.titulos_tabla
					self.isLoading = false

				})
				.catch(function (error){

					alert(error)
					self.isLoading = false

				})

			},
			registrarIncidente: function(evt){

				evt.preventDefault()
				
				var self = this

				var centro_votacion = JSON.parse(localStorage.getItem('centro_votacion'))

				let data = {
					"id_centro" : centro_votacion.id_centro,
					"titulo": this.titulo,
					"descripcion": this.descripcion,
					"tipo": this.tipo,
					"zona": centro_votacion.zona,
					"id_region": centro_votacion.id_region
				}

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/registrar_incidencia',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					self.getData(false)
					self.titulo = ''
					self.descripcion = ''
					self.tipo = null
					self.$refs['modal-grabar'].hide()

					self.$toasted.show('Incidencia registrada', {
						duration: 2000,
						position: 'bottom-center',
						icon: 'check'					
					})

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

					console.log(response.data)
					self.detalle_incidencia = response.data.data.detalles[0]
					self.$refs['modal-detalles'].show()

				})
				.catch(function (error){

					alert(error)

				})

			},
			cambiarEstado: function(evt){

				evt.preventDefault()
				
				var self = this

				axios({
					method: 'POST',
					url: 'https://project2019.club/api_proyectojunio/public/cambiar_estado_incidencia',
					headers: {
						'content-type': 'application/json'
					},
					data: this.detalle_incidencia

				})
				.then(function (response){

					self.$refs['modal-detalles'].hide()

					self.$toasted.show('Incidencia actualizada', {
						duration: 2000,
						position: 'bottom-center',
						icon: 'check'					
					})

					self.getData(false)

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
			onReset: function(){

				this.$refs['modal-grabar'].hide()

			}

		},
		mounted(){

			this.getData(true)

			this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
				
				this.tipo = null,
				this.titulo = '',
				this.descripcion = ''

			})

		},
		computed: {
			rows(){
				return this.incidentes.length
			}
		}

	}

</script>