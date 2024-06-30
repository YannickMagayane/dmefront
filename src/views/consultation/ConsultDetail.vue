<template>
    <div class="container mx-auto p-4">
      <div v-if="patientDetails" class="bg-white shadow-md rounded-lg p-6">
        <h1 class="text-3xl font-bold mb-4 text-gray-700 text-center">Détails du Patient</h1>
  
        <!-- Informations du Patient -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">Informations du Patient</h2>
          <div class="flex justify-between">
            <div>
              <p><strong>Nom:</strong> {{ patientDetails.nom }}</p>
              <p><strong>Post-nom:</strong> {{ patientDetails.post_nom }}</p>
              <p><strong>Prénom:</strong> {{ patientDetails.prenom }}</p>
            </div>
            <div>
              <p><strong>Age:</strong> {{ calculateAge(patientDetails.date_birth) }}</p>
            </div>
          </div>
        </div>
  
        <hr class="my-6">
  
        <div class="mb-6 flex">
          <!-- Consultation -->
          <div class="w-1/2 pr-4">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Consultations</h2>
            <div v-if="showAllConsultations">
              <!-- Show all consultations -->
              <div v-for="consultation in consultations" :key="consultation.id" class="border rounded-lg p-4 mb-4">
                <template v-if="consultation">
                  <p><strong>Date de Consultation:</strong> {{ consultation.date_consultation }}</p>
                  <p><strong>Symptômes:</strong> {{ consultation.symptomes }}</p>
                  <p><strong>Diagnostic:</strong> {{ consultation.diagnostic }}</p>
                  <p><strong>Recommandations:</strong> {{ consultation.recommandations }}</p>
                  <p><strong>Hospitalisation:</strong> {{ consultation.is_hospitaliser ? 'Oui' : 'Non' }}</p>
                  
                </template>
              </div>
            </div>
            <div v-else>
              <!-- Show only the most recent consultation -->
              <div v-if="recentConsultation" class="border rounded-lg p-4 mb-4">
                <template v-if="recentConsultation">
                  <p><strong>Date de Consultation:</strong> {{ recentConsultation.date_consultation }}</p>
                  <p><strong>Symptômes:</strong> {{ recentConsultation.symptomes }}</p>
                  <p><strong>Diagnostic:</strong> {{ recentConsultation.diagnostic }}</p>
                  <p><strong>Recommandations:</strong> {{ recentConsultation.recommandations }}</p>
                  <p><strong>Hospitalisation:</strong> {{ recentConsultation.is_hospitaliser ? 'Oui' : 'Non' }}</p>
  
                 
                </template>
              </div>
            </div>
            <button @click="toggleConsultations" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              {{ showAllConsultations ? 'Voir la consultation la plus récente' : 'Voir toutes les consultations' }}
            </button>
          </div>
  
          <!-- SSI -->
          <div class="w-1/2 pl-4">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Service des soins Infirmiere</h2>
            <div v-if="recentSSI && recentSSI.temperature !== null">
              <p><strong>Température:</strong> {{ recentSSI.temperature }} °C</p>
            </div>
            <div v-if="recentSSI && recentSSI.tension !== null">
              <p><strong>Tension:</strong> {{ recentSSI.tension }}</p>
            </div>
            <div v-if="recentSSI && recentSSI.poids !== null">
              <p><strong>Poids:</strong> {{ recentSSI.poids }} kg</p>
            </div>
            <div v-if="recentSSI && recentSSI.date_register !== null">
              <p><strong>Date d'enregistrement:</strong> {{ recentSSI.date_register }}</p>
            </div>
            <div v-if="!recentSSI">
              <p>Aucune information SSI disponible.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        patientId: null,
        patientDetails: null,
        consultations: [],
        recentConsultation: null,
        recentSSI: null,
        showAllConsultations: false,
      };
    },
    mounted() {
      this.patientId = this.$route.params.patientId;
      this.fetchPatientDetails();
    },
    methods: {
      fetchPatientDetails() {
        if (this.patientId) {
          axios.get(`http://127.0.0.1:8000/patient/patients/${this.patientId}/`)
            .then(response => {
              this.patientDetails = response.data;
              this.fetchConsultations();
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des détails du patient :', error);
            });
        }
      },
      fetchConsultations() {
        axios.get(`http://127.0.0.1:8000/consultation/consultations/?patient=${this.patientId}&order_by=-date_consultation`)
          .then(response => {
            this.consultations = response.data;
            if (this.consultations.length > 0) {
              this.recentConsultation = this.consultations[0];
              this.fetchRecentSSI();
            }
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des consultations :', error);
          });
      },
      fetchRecentSSI() {
        axios.get(`http://127.0.0.1:8000/patient/ssi/?patient=${this.patientId}`)
          .then(response => {
            if (response.data && response.data.length > 0) {
              this.recentSSI = response.data[response.data.length - 1];
            }
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des informations SSI les plus récentes :', error);
          });
      },
      toggleConsultations() {
        this.showAllConsultations = !this.showAllConsultations;
      },
      calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
  
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          const months = (today.getMonth() - birthDate.getMonth() + 12) % 12;
          return `${months} mois`;
        } else {
          return `${age} ans`;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1000px;
    margin: auto;
    padding: 1rem;
  }
  
  .bg-white {
    background-color: #ffffff;
  }
  
  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .rounded-lg {
    border-radius: 8px;
  }
  
  .p-6 {
    padding: 1.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1.5rem;
  }
  
  .text-gray-700 {
    color: #4a5568;
  }
  
  .text-gray-800 {
    color: #2d3748;
  }
  
  .text-center {
    text-align: center;
  }
  
  .font-bold {
    font-weight: bold;
  }
  
  .font-semibold {
    font-weight: 600;
  }
  
  .bg-blue-500 {
    background-color: #4299e1;
  }
  
  .hover\:bg-blue-700:hover {
    background-color: #2b6cb0;
  }
  
  .text-white {
    color: #ffffff;
  }
  
  .mt-4 {
    margin-top: 1.5rem;
  }
  
  .py-2 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  
  .px-4 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .rounded {
    border-radius: 0.25rem;
  }
  
  .border {
    border: 1px solid #e2e8f0;
  }
  
  .pr-4 {
    padding-right: 1.5rem;
  }
  
  .pl-4 {
    padding-left: 1.5rem;
  }
  
  .flex {
    display: flex;
    align-items: flex-start;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  </style>
  