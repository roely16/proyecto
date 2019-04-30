<template>
	<div>
		
		<b-container>
			<b-table class="tabla" dark striped :items="this.items" caption-top>
				<template slot="table-caption">Monitor de Incidencias</template>
				<template slot="zona" slot-scope="data">
					<h1>{{ data.value }}</h1>
				</template>
				<template slot="finalizadas" slot-scope="data">
					<b-button :to="{ name: 'IncidentesFinalizados', params: { zona: data.item.zona, region: persona.id_region } }" variant="success" style="width: 100%;" size="lg">{{ data.value }}</b-button>
				</template>
				<template slot="pendientes" slot-scope="data">

					<b-button v-if="data.value > 0" :to="{ name: 'IncidentesPendientes', params: { zona: data.item.zona, region: persona.id_region } }"  variant="danger" style="width: 100%;" size="lg">{{ data.value }}</b-button>

					<b-button v-else variant="danger" style="width: 100%;" size="lg">{{ data.value }}</b-button>

				</template>
		 </b-table>
		</b-container>

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
				persona: JSON.parse(localStorage.getItem('datos_persona')),  
				isLoading: false,
				items: [],
				
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
					url: 'https://project2019.club/api_proyectojunio/public/incidencias_region',
					headers: {
						'content-type': 'application/json'
					},
					data: data

				})
				.then(function (response){

					console.log(response.data)
					self.items = response.data

				})
				.catch(function (error){

					alert(error)

				})

			}

		},
		mounted(){

			this.getData()

		},
		

	}

</script>