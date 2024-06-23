<template>
  <div class="max-w-lg mx-auto mt-10">
    <h1 class="text-3xl font-bold mb-6 text-center">Créer un patient</h1>
    <form @submit.prevent="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label for="nom" class="block text-gray-700 text-sm font-bold mb-2">Nom :</label>
        <input type="text" id="nom" v-model="nom" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="postNom" class="block text-gray-700 text-sm font-bold mb-2">Post-Nom :</label>
        <input type="text" id="postNom" v-model="postNom" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="prenom" class="block text-gray-700 text-sm font-bold mb-2">Prénom :</label>
        <input type="text" id="prenom" v-model="prenom" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="adresse" class="block text-gray-700 text-sm font-bold mb-2">Adresse :</label>
        <input type="text" id="adresse" v-model="adresse" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="genre" class="block text-gray-700 text-sm font-bold mb-2">Genre :</label>
        <select id="genre" v-model="genre" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="m">Male</option>
          <option value="f">Female</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="dateNaissance" class="block text-gray-700 text-sm font-bold mb-2">Date de naissance :</label>
        <input type="date" id="dateNaissance" v-model="dateNaissance" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Créer
      </button>
      <!-- Hover card pour afficher le message de confirmation -->
      <div v-if="showConfirmation" class="fixed bottom-0 right-0 m-4">
        <div class="bg-green-500 text-white font-bold py-2 px-4 rounded shadow-md">
          Patient créé avec succès!
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'CreatePatient',
  data() {
    return {
      nom: '',
      postNom: '',
      prenom: '',
      adresse: '',
      genre: 'm',
      dateNaissance: '',
      code: '',
      showConfirmation: false // Ajoutez une variable pour contrôler l'affichage de la hover card
    };
  },
  methods: {
    submitForm() {
      const patientData = {
        nom: this.nom,
        post_nom: this.postNom,
        prenom: this.prenom,
        adresse: this.adresse,
        genre: this.genre,
        date_birth: this.dateNaissance,
      };

      axios.post('patient/patients/', patientData)
        .then(response => {
          console.log('Patient créé avec succès:', response.data);
          // Redirection vers la liste des patients
          this.$router.push({ name: 'ListePatients' });

          // Affichage de la hover card de confirmation
          this.showConfirmation = true;
          setTimeout(() => {
            this.showConfirmation = false;
          }, 3000); // Masquer la hover card après 3 secondes
        })
        .catch(error => {
          console.error('Erreur lors de la création du patient:', error);
          // Affichage de l'alerte d'erreur
          alert('Erreur lors de la création du patient');
        });
    }
  }
};
</script>

<style scoped>
/* Vos styles personnalisés ici */
</style>
