import { createRouter, createWebHistory } from 'vue-router';
import ListePatients from '../views/patient/ListePatients.vue';
import CreatePatient from '../views/patient/CreatePatient.vue';
import ModifierPatient from '../views/patient/ModifierPatient.vue';
import CartePatient from '../views/patient/CartePatient.vue';
import VisitePatient from '../views/patient/VisitePatient.vue';  
import GestionSSI from '../views/ssi/GestionSSI.vue'; 
import HomeView from '../views/HomeView.vue';
import PatientsSansConsultation from '../views/consultation/PatientsSansConsultation.vue';  
import ConsultationManager from '../views/consultation/ConsultationManager.vue';  
import ConsultDetail from '../views/consultation/ConsultDetail.vue'
import AssignMedicament from '../views/consultation/AssignMedicament.vue'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
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
    path: '/carte-patient/:id', 
    name: 'CartePatient',
    component: CartePatient,
  },
  {
    path: '/visite-patient',
    name: 'VisitePatient',
    component: VisitePatient,      //creer visite
  },
  {
    path: '/gestion-ssi',
    name: 'GestionSSI',
    component: GestionSSI,
  },
  {
    path: '/patients-sans-consultation',  // Ajout de la nouvelle route
    name: 'PatientsSansConsultation',
    component: PatientsSansConsultation,
  },
  {
    path: '/consultation-manager',
    name: 'ConsultationManager',  // Ajoutez la nouvelle route
    component: ConsultationManager,
  },
  
  {
    path: '/consultations/:consultationId/medicament',
    name: 'AssignMedicament',
    component: AssignMedicament,
    props: true,
  },
  {
    path: '/consult/:patientId',
    name: 'ConsultDetail',
    component: ConsultDetail,
    props: true, 

  },
  

  // Ajoutez d'autres routes ici
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
