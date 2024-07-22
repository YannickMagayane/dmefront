<template>
  <div class="container mx-auto p-4">
    <div class="bg-white shadow-md rounded-lg p-6">
      <h1 class="text-3xl font-bold mb-4 text-gray-700 text-center">Assigner des Médicaments</h1>

      <!-- Form for assigning multiple medications -->
      <form @submit.prevent="assignMedications">
        <div v-for="(medication, index) in medications" :key="index" class="mb-4 border-b pb-4">
          <h2 class="text-xl font-semibold mb-2">Médicament {{ index + 1 }}</h2>
          <div class="mb-4">
            <label class="block text-gray-800 font-semibold mb-2">Nom du Médicament</label>
            <input type="text" v-model="medication.nom" class="border rounded-lg px-3 py-2 w-full">
          </div>
          <div class="mb-4">
            <label class="block text-gray-800 font-semibold mb-2">Dosage</label>
            <input type="text" v-model="medication.dosage" class="border rounded-lg px-3 py-2 w-full">
          </div>
          <div class="mb-4">
            <label class="block text-gray-800 font-semibold mb-2">Fréquence</label>
            <input type="text" v-model="medication.frequence" class="border rounded-lg px-3 py-2 w-full">
          </div>
          <div class="mb-4">
            <label class="block text-gray-800 font-semibold mb-2">Durée</label>
            <input type="text" v-model="medication.duree" class="border rounded-lg px-3 py-2 w-full">
          </div>
          <button @click="removeMedication(index)" type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
            Supprimer ce Médicament
          </button>
        </div>
        <button @click="addMedication" type="button" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
          Ajouter un Médicament
        </button>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Assigner les Médicaments
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
      medications: [
        {
          nom: '',
          dosage: '',
          frequence: '',
          duree: '',
          consultation: this.consultationId, // Assignation de l'ID de consultation
        },
      ],
    };
  },
  methods: {
    addMedication() {
      this.medications.push({
        nom: '',
        dosage: '',
        frequence: '',
        duree: '',
        consultation: this.consultationId,
      });
    },
    removeMedication(index) {
      this.medications.splice(index, 1);
    },
    assignMedications() {
      // Reset the consultation ID for each medication to ensure it's correct
      this.medications.forEach(medication => {
        medication.consultation = this.consultationId;
      });

      // Submit each medication individually
      const requests = this.medications.map(medication =>
        axios.post('http://127.0.0.1:8000/consultation/medicaments-prescrits/', medication)
      );

      axios.all(requests)
        .then(axios.spread((...responses) => {
          console.log('Tous les médicaments ont été assignés avec succès', responses);
          // Redirection vers ConsultationManager si succès
          this.$router.push({ name: 'ConsultationManager' });
        }))
        .catch(errors => {
          console.error('Erreur lors de l\'assignation des médicaments :', errors);
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
