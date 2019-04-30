<template>
  	<div class="fondo">
		<main>

			<div v-if="this.authenticated" >
				<b-navbar sticky toggleable="lg" type="dark" variant="info">
					<b-navbar-brand href="#">Control y Monitoreo</b-navbar-brand>

					<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

					<b-collapse id="nav-collapse" is-nav>

						<b-navbar-nav class="ml-auto">

							<b-nav-item-dropdown right>
								<template slot="button-content">
									<strong>
										{{ this.persona.nombre }}
									</strong>

								</template>
								<b-dropdown-item v-on:click="salir" href="#/">
									Salir
								</b-dropdown-item>
							</b-nav-item-dropdown>
						</b-navbar-nav>
					</b-collapse>
				</b-navbar>
			</div>

			<div v-if="this.isCentroVotacion">
				<b-container  style="margin-top: 10px;" >
					<strong>Centro de Votación</strong>
					<b-form-textarea readonly id="input-1" v-model="centro_votacion.nombre"></b-form-textarea>
				</b-container>
			</div>
			
			<router-view @authenticated="setAuthenticated" @centro="setCentroVotacion" />
		</main>
  	</div>
</template>

<style scoped>
	ul {
		list-style: none;
		display: flex;
		padding: 0;
	}
	li {
		padding: 5px 15px 5px 0;
	}
	li a {
		text-decoration: none;
		color: black;
	}
	li a:hover {
		color: #404040;
	}
</style>

<script>
export default {

	data() {
		return {
			isCentroVotacion: false,
			authenticated: false,
			persona: JSON.parse(localStorage.getItem('datos_persona')),
			centro_votacion: JSON.parse(localStorage.getItem('centro_votacion')),
		}
	},
	mounted(){

		this.authenticated = localStorage.getItem('auth')
		this.isCentroVotacion = localStorage.getItem('is_centro')

	},
	methods: {

		salir(){

			localStorage.removeItem('datos_persona')
			localStorage.removeItem('centro_votacion')
			localStorage.removeItem('auth')
			localStorage.removeItem('is_centro')
			this.persona = ''
			this.centro_votacion = ''
			this.authenticated = false
			this.isCentroVotacion = false

		},
		setAuthenticated(status){

			if (status) {
				this.authenticated = status
				this.persona = JSON.parse(localStorage.getItem('datos_persona'))
			}

		},
		setCentroVotacion(status){

			if (status) {
				this.isCentroVotacion = status
				this.centro_votacion = JSON.parse(localStorage.getItem('centro_votacion'))
			}

		}

	}
}
</script>
