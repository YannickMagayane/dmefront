<template>
    <div class="text-black flex justify-center min-h-screen bg-gradient-to-t from-slate-300 to-white-900">
      <div class="container mx-auto px-4 py-8" :class="{ 'blur-background': showForm }">
        <h2 class="text-3xl text-center text-black font-bold mb-6">Bienvenue au Service des Soins Infirmiers</h2>
        <div class="overflow-x-auto bg-white shadow-lg rounded-lg p-6" v-if="ssis.length > 0">
          <table class="table-auto w-full text-center uppercase shadow-md rounded-md text-black">
            <thead class="bg-blue-600 text-white">
              <tr class="font-bold">
                <th class="px-4 py-3">Nom Patient</th>
                <th class="px-4 py-3">Température</th>
                <th class="px-4 py-3">Tension</th>
                <th class="px-4 py-3">Poids</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ssi in ssis" :key="ssi.id" class="hover:bg-gray-200 cursor-pointer" @click="openForm(ssi)">
                <td class="border-t px-4 py-2 text-left font-medium">{{ getNomPatient(ssi.patient) }}</td>
                <td class="border-t px-4 py-2">{{ ssi.temperature ?? 'N/A' }}</td>
                <td class="border-t px-4 py-2">{{ ssi.tension || 'N/A' }}</td>
                <td class="border-t px-4 py-2">{{ ssi.poids ?? 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="mt-6 text-center text-black font-extrabold uppercase">
          Aucun SSI sans données de température, tension et poids
        </div>
      </div>
      
      <!-- Form pour update -->
      <div v-if="showForm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg p-6 w-1/2">
          <h2 class="text-lg font-bold mb-4 text-center">Modifier SSI pour {{ getNomPatient(selectedSSI.patient) }}</h2>
          <form @submit.prevent="updateSSI" v-if="selectedSSI !== null">
            <div class="mb-4">
              <label for="temperature" class="block font-bold text-sm">Température :</label>
              <input type="number" id="temperature" v-model="newSSI.temperature" required class="border border-gray-400 px-2 py-1 rounded w-full" placeholder="Temperature du patient">
            </div>
            <div class="mb-4">
              <label for="tension" class="block font-bold text-sm">Tension :</label>
              <input type="text" id="tension" v-model="newSSI.tension" required class="border border-gray-400 px-2 py-1 rounded w-full" placeholder="Tension du patient">
            </div>
            <div class="mb-4">
              <label for="poids" class="block font-bold text-sm">Poids :</label>
              <input type="number" id="poids" v-model="newSSI.poids" required class="border border-gray-400 px-2 py-1 rounded w-full" placeholder="Poids du patient">
            </div>
            <!-- Utiliser l'ID du patient sélectionné pour l'update -->
            <input type="hidden" v-model="selectedSSI.patient">
            <div class="flex justify-end">
              <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enregistrer</button>
              <button @click="closeForm" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        ssis: [],
        patients: [],
        showForm: false,
        selectedSSI: null,
        newSSI: {
          temperature: null,
          tension: '',
          poids: null,
          patient: null
        }
      };
    },
    mounted() {
      this.fetchSSIs();
      this.fetchPatients();
      this.actualiserPage(); // Appel de la fonction d'actualisation automatique

    },
    
    methods: {
        
        actualiserPage() {
      setTimeout(() => {
        // Vérifier si le formulaire est actuellement ouvert
        if (!this.showForm) {
          location.reload();
        }
        // Répéter l'actualisation toutes les 5 secondes
        this.actualiserPage();
      }, 5000); // 5000 millisecondes = 5 secondes
    },
      async fetchSSIs() {
        try {
          const response = await axios.get('http://127.0.0.1:8000/patient/ssi/');
          if (Array.isArray(response.data)) {
            this.ssis = response.data.filter(ssi => ssi.temperature === null && ssi.tension === '' && ssi.poids === null);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des SSI :', error);
        }
      },
      async fetchPatients() {
        try {
          const response = await axios.get('http://127.0.0.1:8000/patient/patients/');
          if (Array.isArray(response.data)) {
            this.patients = response.data;
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des patients :', error);
        }
      },
      getNomPatient(patientId) {
        const patient = this.patients.find(patient => patient.id === patientId);
        if (patient) {
          return `${patient.nom} ${patient.post_nom} ${patient.prenom}`;
        }
        return null;
      },
      openForm(ssi) {
        this.selectedSSI = ssi;
        this.newSSI.temperature = ssi.temperature;
        this.newSSI.tension = ssi.tension;
        this.newSSI.poids = ssi.poids;
        this.showForm = true;
      },
      closeForm() {
        this.showForm = false;
        this.newSSI = {
          temperature: null,
          tension: '',
          poids: null,
          patient: null
        };
      },
      async updateSSI() {
        try {
          // Vérifiez d'abord si l'ID du patient est défini
          if (!this.selectedSSI || !this.selectedSSI.patient) {
            console.error('ID du patient non défini.');
            return;
          }
  
          // Mettez à jour newSSI.patient avec l'ID du patient sélectionné
          this.newSSI.patient = this.selectedSSI.patient;
  
          const response = await axios.put(`http://127.0.0.1:8000/patient/ssi/${this.selectedSSI.id}/`, this.newSSI);
          const updatedSSI = response.data;
  
          // Mettre à jour la liste des SSI avec l'élément mis à jour
          const index = this.ssis.findIndex(ssi => ssi.id === updatedSSI.id);
          if (index !== -1) {
            this.ssis.splice(index, 1, updatedSSI);
          }
  
          this.closeForm();
        } catch (error) {
          console.error('Erreur lors de la mise à jour du SSI :', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez vos styles CSS personnalisés ici si nécessaire */
  .blur-background {
    filter: blur(4px);
  }
  
  .table-auto {
    width: 100%;
  }
  
  .table-auto th,
  .table-auto td {
    padding: 1rem;
  }
  
  .bg-blue-600 {
    background-color: #3182ce;
  }
  
  .hover\:bg-gray-200:hover {
    background-color: #edf2f7;
  }
  
  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .bg-opacity-50 {
    background-color: rgba(0, 0, 0, 0.5);
  }
  </style>
  