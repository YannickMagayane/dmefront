import { createRouter, createWebHistory } from 'vue-router';
import ListePatients from '../views/patient/ListePatients.vue'
import CreatePatient from '../views/patient/CreatePatient.vue'
import ModifierPatient from '../views/patient/ModifierPatient.vue'
import CartePatient from '../views/patient/CartePatient.vue'
import HomeView from '../views/HomeView.vue';


const routes = [

  {
    path: '/patients',
    name: 'ListePatients',
    component: ListePatients,
  },
  {
    path: '/create-patient',
    name: 'CreatePatient',
    component: CreatePatient, 
  },
  {
    path: '/modifier-patient/:id', 
    name: 'ModifierPatient',
    component: ModifierPatient,
  },
  {
    path: '/carte-patient/:id', // Définissez le chemin pour la vue CartePatient avec un paramètre dynamique pour l'ID du patient
    name: 'CartePatient',
    component: CartePatient,
   
  },
  
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  
  // Ajoutez d'autres routes ici
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
