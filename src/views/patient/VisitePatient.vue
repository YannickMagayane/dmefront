<template>
    <div class="relative min-h-screen bg-gradient-to-tr from-slate-300 to-white-800">
      <div class="container mx-auto py-5 justify-items-center text-center">
        <h2 class="text-3xl font-bold text-black mb-5 uppercase">Ajouter une visite patient</h2>
        <form class="max-w-md mx-auto bg-white rounded p-6 shadow-md">
          <!-- Champ de sélection du patient -->
          <div class="mb-6 flex items-center">
            <label for="patient" class="block text-gray-700 text-sm font-bold mb-2 w-1/2">Patient :</label>
            <input type="text" id="patient" v-model="selectedPatient" list="patientsList" placeholder="Saisir le nom du patient"
              class="w-1/2 ml-2 px-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <datalist id="patientsList">
              <option v-for="patient in patients" :key="patient.id" :value="`${patient.nom} ${patient.post_nom} ${patient.prenom}`"></option>
            </datalist>
          </div>
  
          <!-- Section pour afficher les détails du patient sélectionné -->
          <div v-if="selectedPatientDetails" class="mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Détails du patient</h3>
            <p><strong>Nom complet :</strong> {{ selectedPatientDetails.nom }} {{ selectedPatientDetails.post_nom }} {{ selectedPatientDetails.prenom }}</p>
            <p><strong>Adresse :</strong> {{ selectedPatientDetails.adresse }}</p>
            <p><strong>Date de Naissance :</strong> {{ selectedPatientDetails.date_birth }}</p>
            <p><strong>Code :</strong> {{  selectedPatientDetails.code  }}</p>
            <!-- Ajoutez d'autres détails du patient ici -->
          </div>
  
          <!-- Bouton pour ajouter la visite -->
          <div class="flex justify-center">
            <button type="button" @click="addVisit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Ajouter
            </button>
          </div>
  
          <!-- Carte pour afficher les messages -->
          <div v-if="successMessage" class="mt-4">
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
              <p class="font-bold">{{ successMessage }}</p>
            </div>
          </div>
          <div v-if="errorMessage" class="mt-4">
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p class="font-bold">{{ errorMessage }}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        NewVisite: {
          date_visite: null,
        },
        selectedPatient: null, // Champ pour stocker le nom complet du patient
        selectedPatientDetails: null, // Détails du patient sélectionné
        patients: [],
        successMessage: '', // Message de succès
        errorMessage: '', // Message d'erreur
      };
    },
    mounted() {
      this.fetchPatients();
    },
    methods: {
      async addVisit() {
        try {
          // Récupérer l'ID du patient à partir de son nom complet
          const selectedPatient = this.selectedPatient;
          const patientID = this.patients.find(patient => `${patient.nom} ${patient.post_nom} ${patient.prenom}` === selectedPatient)?.id;
  
          if (!patientID) {
            throw new Error("Patient n'existe pas.");
          }
  
          const formData = {
            patient: patientID,
            date_visite: new Date(this.NewVisite.date_visite).toISOString(),
          };
  
          const response = await axios.post("http://127.0.0.1:8000/patient/visitepatient/", formData);
  
          if (response.status === 201) {
            this.successMessage = "Le patient peut aller au services de soins infirmieres !";
            this.errorMessage = ''; // Réinitialiser le message d'erreur
            this.NewVisite.date_visite = null;
            this.selectedPatient = null; // Réinitialiser le champ patient
  
            // Rediriger vers la liste des patients après l'ajout
            this.$router.push({ name: 'ListePatients' });
          } else {
            throw new Error("Patient n'est pas reconnu.");
          }
        } catch (error) {
          this.errorMessage = error.message;
          console.error(error);
        }
      },
      async fetchPatients() {
        try {
          const response = await axios.get("http://127.0.0.1:8000/patient/patients/");
  
          if (response.status === 200) {
            this.patients = response.data;
          }
        } catch (error) {
          console.error(error);
        }
      },
      async fetchPatientDetails() {
        try {
          const selectedPatient = this.selectedPatient;
          const patientDetails = this.patients.find(patient => `${patient.nom} ${patient.post_nom} ${patient.prenom}` === selectedPatient);
  
          if (patientDetails) {
            this.selectedPatientDetails = patientDetails;
          } else {
            this.selectedPatientDetails = null;
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
    watch: {
      selectedPatient: {
        immediate: true,
        handler(newVal) {
          this.selectedPatientDetails = null;
          if (newVal) {
            this.fetchPatientDetails();
          }
        },
      },
    },
  };
  </script>
  
  <style>
  /* Ajoutez vos styles CSS personnalisés ici */
  </style>
  