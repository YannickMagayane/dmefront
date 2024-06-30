<template>
    <div class="container mx-auto p-4">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h1 class="text-3xl font-bold mb-4 text-gray-700 text-center">Assigner un Médicament</h1>
  
        <!-- Form for assigning medication -->
        <form @submit.prevent="assignMedication">
          <div class="mb-4">
            <label for="medicationName" class="block text-gray-800 font-semibold mb-2">Nom du Médicament</label>
            <input type="text" id="medicationName" v-model="medication.nom" class="border rounded-lg px-3 py-2 w-full">
          </div>
          <div class="mb-4">
            <label for="dosage" class="block text-gray-800 font-semibold mb-2">Dosage</label>
            <input type="text" id="dosage" v-model="medication.dosage" class="border rounded-lg px-3 py-2 w-full">
          </div>
          <div class="mb-4">
            <label for="frequence" class="block text-gray-800 font-semibold mb-2">Fréquence</label>
            <input type="text" id="frequence" v-model="medication.frequence" class="border rounded-lg px-3 py-2 w-full">
          </div>
          <div class="mb-4">
            <label for="duree" class="block text-gray-800 font-semibold mb-2">Durée</label>
            <input type="text" id="duree" v-model="medication.duree" class="border rounded-lg px-3 py-2 w-full">
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Assigner le Médicament
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      consultationId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        medication: {
          nom: '',
          dosage: '',
          frequence: '',
          duree: '',
          consultation: this.consultationId, // Assignation de l'ID de consultation
        },
      };
    },
    methods: {
      assignMedication() {
        axios.post('http://127.0.0.1:8000/consultation/medicaments-prescrits/', this.medication)
          .then(response => {
            
          console.log('Médicament assigné avec succès :', response.data);
          // Redirection vers ConsultationManager si succès
          this.$router.push({ name: 'ConsultationManager' });
          })
          .catch(error => {
            console.error('Erreur lors de l\'assignation du médicament :', error);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
  }
  
  label {
    font-weight: bold;
  }
  
  button {
    color: #fff;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  button:disabled:hover {
    background-color: #2563eb;
  }
  </style>
  