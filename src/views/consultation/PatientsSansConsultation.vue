<template>
    <div>
      <h1 class="text-3xl font-bold my-4 text-center">Services de Consultation</h1>
  
      <!-- Tableau des patients -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Température (Celsius)</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tension</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids (Kg)</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="patient in filteredPatients" :key="patient.id" class="hover:bg-gray-100 cursor-pointer" @click="showConsultationForm(patient)">
          <td class="px-3 py-3 whitespace-nowrap">{{ getNomComplet(patient) }}</td>
          <td class="px-3 py-3 whitespace-nowrap">{{ patient.temperature }}</td>
          <td class="px-3 py-3 whitespace-nowrap">{{ patient.tension }}</td>
          <td class="px-3 py-3 whitespace-nowrap">{{ patient.poids }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
      <!-- Formulaire de consultation (caché par défaut) -->
      <div v-if="selectedPatient !== null" class="form-overlay">
        <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 class="text-lg font-bold mb-4 text-center">Nouvelle Consultation pour {{ getNomComplet(selectedPatient) }}</h2>
          <form @submit.prevent="submitConsultation">
            <div class="mb-4">
              <label for="symptomes" class="block font-bold text-sm">Symptômes :</label>
              <textarea id="symptomes" v-model="consultation.symptomes" class="border border-gray-400 px-2 py-1 rounded w-full" rows="3" placeholder="Symptômes du patient"></textarea>
            </div>
            <div class="mb-4">
              <label for="diagnostic" class="block font-bold text-sm">Diagnostic :</label>
              <textarea id="diagnostic" v-model="consultation.diagnostic" class="border border-gray-400 px-2 py-1 rounded w-full" rows="3" placeholder="Diagnostic de la consultation"></textarea>
            </div>
            <div class="mb-4">
              <label for="recommandations" class="block font-bold text-sm">Recommandations :</label>
              <textarea id="recommandations" v-model="consultation.recommandations" class="border border-gray-400 px-2 py-1 rounded w-full" rows="3" placeholder="Recommandations pour le patient"></textarea>
            </div>
            <div class="mb-4">
              <label for="hospitalisation" class="block font-bold text-sm">Hospitalisation :</label>
              <input type="checkbox" id="hospitalisation" v-model="consultation.is_hospitaliser" class="form-checkbox" />
              <label for="hospitalisation" class="ml-2">Hospitaliser</label>
            </div>
            <div class="flex justify-between">
  <button type="button" @click="selectedPatient = null" class="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg">Annuler</button> &nbsp;
  <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Enregistrer Consultation</button>
</div>

          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'PatientsSansConsultation',
    data() {
      return {
        patientsSSI: [],
        consultations: [],
        patients: [],
        filteredPatients: [],
        selectedPatient: null, // Patient sélectionné pour consultation
        consultation: {
          patient: null,
          symptomes: '',
          diagnostic: '',
          recommandations: '',
          is_hospitaliser: false,
        },
      };
    },
    mounted() {
      this.fetchPatientsSSI();
      this.fetchConsultations();
      this.fetchPatients();
    },
    computed: {
      patientsWithConsultation() {
        return this.patientsSSI.filter(patient =>
          this.consultations.some(consultation => consultation.patient === patient.patient)
        );
      },
    },
    watch: {
      patientsWithConsultation: {
        handler() {
          this.applyFilters();
        },
        deep: true,
      },
    },
    methods: {
      fetchPatientsSSI() {
        axios.get('http://127.0.0.1:8000/patient/ssi/')
          .then(response => {
            this.patientsSSI = response.data;
            this.applyFilters();
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des patients SSI :', error);
          });
      },
      fetchConsultations() {
        axios.get('http://127.0.0.1:8000/consultation/consultations/')
          .then(response => {
            this.consultations = response.data;
            this.applyFilters();
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des consultations :', error);
          });
      },
      fetchPatients() {
        axios.get('http://127.0.0.1:8000/patient/patients/')
          .then(response => {
            this.patients = response.data;
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des patients :', error);
          });
      },
      getNomComplet(patient) {
        const foundPatient = this.patients.find(p => p.id === patient.patient);
        if (foundPatient) {
          return `${foundPatient.nom} ${foundPatient.post_nom} ${foundPatient.prenom}`;
        }
        return null;
      },
      startAutoCheckLoginStatus() {
      setInterval(this.checkLoginStatus, 1000); // Auto-check login status every 30 seconds
    },
      applyFilters() {
        this.filteredPatients = this.patientsSSI.filter(patient =>
          !this.consultations.some(consultation => consultation.patient === patient.patient) &&
          patient.temperature !== null &&
          patient.tension !== null &&
          patient.poids !== null
        );
      },
      showConsultationForm(patient) {
        this.selectedPatient = patient;
        this.consultation.patient = patient.patient; // Liaison de l'ID du patient au formulaire de consultation
      },
      async submitConsultation() {
        try {
          console.log('Submitting consultation:', this.consultation);
          await axios.post('http://127.0.0.1:8000/consultation/consultations/', this.consultation);
  
          this.fetchConsultations();
          this.selectedPatient = null;
        } catch (error) {
          console.error('Erreur lors de la soumission de la consultation :', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(8px); /* Ajustez le flou selon vos préférences */
    z-index: 10; /* Assurez-vous que le z-index est plus haut que celui du formulaire pour le placer au-dessus */
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background-color: #f8fafc;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background-color: #edf2f7;
    color: #4a5568;
    font-weight: 600;
  }
  
  tbody tr:hover {
    background-color: #f7fafc;
  }
  
  form {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  form h2 {
    text-align: center;
  }
  
  form .mb-4 {
    margin-bottom: 16px;
  }
  
  form label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  form textarea,
  form input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  form .form-checkbox {
    display: inline-block;
    width: auto;
  }
  
  form .flex {
    display: flex;
    justify-content: space-between;
  }
  
  form button {
    color: #fff;
    font-weight: bold;
    padding: 10px 5px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  form .bg-red-500:hover {
    background-color: #cc0000;
  }
  
  form .bg-blue-500:hover {
    background-color: #0056b3;
  }
  .bg-white {
  width: 80%; /* Adjust width as per your design */
  margin: 0 auto; /* Center the table horizontally */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f0f4f8; /* Light gray background for header */
}

th, td {
  padding: 8px; /* Adjust padding for content spacing */
  text-align: left;
  border-bottom: 1px solid #cbd5e0; /* Light gray border bottom for rows */
}

th {
  font-weight: 600; /* Bold font for header */
  color: #4a5568; /* Dark gray text color */
}

tbody tr:hover {
  background-color: #edf2f7; /* Light blue background on hover */
}
  </style>
  