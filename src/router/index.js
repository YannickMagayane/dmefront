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
import ConsultDetail from '../views/consultation/ConsultDetail.vue';
import AssignMedicament from '../views/consultation/AssignMedicament.vue';
import AssignExamen from '../views/consultation/AssignExamen.vue';
import RegisterForm from '../views/RegisterForm.vue';
import LoginForm from '../views/LoginForm.vue';
import UserAffectation from '../views/UserAffectation.vue'; 
import AjouterCategorie from '../views/pharmacie/AjouterCategorie.vue';
import AjouterMedicament from '../views/pharmacie/AjouterMedicament.vue';
import AjouterStock from '../views/pharmacie/AjouterStock.vue';
import VenteMedicament from '../views/pharmacie/VenteMedicament.vue'




const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  
  {
    path: '/patients',
    name: 'ListePatients',
    component: ListePatients,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-patient',
    name: 'CreatePatient',
    component: CreatePatient,
    meta: { requiresAuth: true }
  },
  {
    path: '/modifier-patient/:id', 
    name: 'ModifierPatient',
    component: ModifierPatient,
    meta: { requiresAuth: true }
  },
  {
    path: '/carte-patient/:id', 
    name: 'CartePatient',
    component: CartePatient,
    meta: { requiresAuth: true }
  },
  {
    path: '/visite-patient',
    name: 'VisitePatient',
    component: VisitePatient,
    meta: { requiresAuth: true }
  },
  {
    path: '/ajouter-categorie',
    name: 'AjouterCategorie',
    component: AjouterCategorie,

  },
  {
    path: '/vente-medicament',
    name: 'VenteMedicament',
    component: VenteMedicament,

  },
  {
    path: '/ajouter-medicament',
    name: 'AjouterMedicament',
    component: AjouterMedicament,

  },
  {
    path: '/ajouter-stock',
    name: 'AjouterStock',
    component: AjouterStock,

  },
  {
    path: '/gestion-ssi',
    name: 'GestionSSI',
    component: GestionSSI,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients-sans-consultation', 
    name: 'PatientsSansConsultation',
    component: PatientsSansConsultation,
    meta: { requiresAuth: true }
  },
  {
    path: '/consultation-manager',
    name: 'ConsultationManager', 
    component: ConsultationManager,
    meta: { requiresAuth: true }
  },
  {
    path: '/consultations/:consultationId/medicament',
    name: 'AssignMedicament',
    component: AssignMedicament,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/examen/:consultationId/examen',
    name: 'AssignExamen',
    component: AssignExamen,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/consult/:patientId',
    name: 'ConsultDetail',
    component: ConsultDetail,
    props: true, 
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'RegisterForm',
    component: RegisterForm
  },
  {
    path: '/user',  // Ajout de la route pour PatientAffectation
    name: 'UserAffectation',
    component: UserAffectation,
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      localStorage.removeItem('token');
      next('/');
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
