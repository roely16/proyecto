import Vue from 'vue'
import Router from 'vue-router'

// Page content
import Page1 from '@/components/Page1'
import Home from '@/components/Home'
import Login from '@/components/Login'

//Logistica
import LogisticaCentro from '@/components/LogisticaCentro'

// Incidencias
import Incidencias from '@/components/Incidencias'

//Ingreso de Resultados
import IngresoResultados from '@/components/IngresoResultados'

//Monitor de Incidencias
import MonitorIncidencias from '@/components/MonitorIncidencias'
import IncidentesFinalizados from '@/components/IncidentesFinalizados'
import IncidentesPendientes from '@/components/IncidentesPendientes'

//Logistica Region
import LogisticaRegion from '@/components/LogisticaRegion'

//Logistica General 
import LogisticaGeneral from '@/components/LogisticaGeneral'

//Logistica Zona
import LogisticaZona from '@/components/LogisticaZona'

//Monitor de Impugnaciones
import MonitorImpugnaciones from '@/components/MonitorImpugnaciones'
import ImpugnacionesPendientes from '@/components/ImpugnacionesPendientes'

Vue.use(Router)

const router = new Router({
	routes: [
		{
			path: '/',
			name: 'Login',
			component: Login
		},
		{
			path: '/home',
			name: 'Home',
			component: Home
		},
		{
			path: '/logistica_centro',
			name: 'LogisticaCentro',
			component: LogisticaCentro
		},
		{
			path: '/registro_incidencias',
			name: 'RegistroIncidencias',
			component: Incidencias
		},
		{
			path: '/ingreso_resultados',
			name: 'IngresoResultados',
			component: IngresoResultados
		},
		{
			path: '/monitor_incidencias',
			name: 'MonitorIncidencias',
			component: MonitorIncidencias
		},
		{
			path: '/monitor_incidencias/incidentes_finalizados/:zona/:region',
			name: 'IncidentesFinalizados',
			component: IncidentesFinalizados
		},
		{
			path: '/monitor_incidencias/incidentes_pendientes/:zona/:region',
			name: 'IncidentesPendientes',
			component: IncidentesPendientes
		},
		{
			path: '/logistica_region',
			name: 'LogisticaRegion',
			component: LogisticaRegion
		},
		{
			path: '/logistica_general',
			name: 'LogisticaGeneral',
			component: LogisticaGeneral
		},
		{
			path: '/logistica_zona',
			name: 'LogisticaZona',
			component: LogisticaZona
		},
		{
			path: '/monitor_impugnaciones',
			name: 'MonitorImpugnaciones',
			component: MonitorImpugnaciones
		},
		{
			path: '/monitor_impugnaciones/impugnaciones_pendientes/:zona',
			name: 'ImpugnacionesPendientes',
			component: ImpugnacionesPendientes
		},
		{
			path: '/page-1',
			name: 'Page 1',
			component: Page1
		},
		{
			path: '**',
			redirect: '/'
		}
	]
})

router.beforeEach((to, from, next) => {

	const publicPages = ['/'];
	const authRequired = !publicPages.includes(to.path);
	const loggedIn = localStorage.getItem('datos_persona')

	if (authRequired && !loggedIn) {
		return next('/');
	}

	if (to.name == "Login") {
		
		if (localStorage.getItem('auth')) {
			
			return next('/home');

		}

	}

	next();
})

export default router
