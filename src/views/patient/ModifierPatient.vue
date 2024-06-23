<template>
    <div class="flex justify-center items-center h-screen">
      <div class="max-w-md w-full px-6">
        <div class="bg-white shadow-md rounded-lg px-8 py-6 hover:shadow-xl transition duration-300">
          <h1 class="text-3xl font-bold my-4 text-center">Modifier le patient</h1>
          <!-- Formulaire de modification -->
          <form @submit.prevent="submitForm" class="mb-4">
            <!-- Champs du formulaire -->
            <div class="mb-4">
              <label for="nom" class="block text-gray-700 text-sm font-bold mb-2">Nom :</label>
              <input type="text" id="nom" v-model="nom" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
              <label for="postNom" class="block text-gray-700 text-sm font-bold mb-2">Post-Nom :</label>
              <input type="text" id="postNom" v-model="postNom" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
              <label for="prenom" class="block text-gray-700 text-sm font-bold mb-2">Prénom :</label>
              <input type="text" id="prenom" v-model="prenom" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
              <label for="adresse" class="block text-gray-700 text-sm font-bold mb-2">Adresse :</label>
              <input type="text" id="adresse" v-model="adresse" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
              <label for="genre" class="block text-gray-700 text-sm font-bold mb-2">Genre :</label>
              <select id="genre" v-model="genre" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="dateNaissance" class="block text-gray-700 text-sm font-bold mb-2">Date de naissance :</label>
              <input type="date" id="dateNaissance" v-model="dateNaissance" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            
            <div class="mb-4">
              <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Enregistrer les modifications</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '@/axios';
  
  export default {
    name: 'ModifierPatient',
    data() {
      return {
        patientId: '', // ID du patient à modifier
        nom: '',
        postNom: '',
        prenom: '',
        adresse: '',
        genre: 'm',
        dateNaissance: '',
      };
    },
    mounted() {
      // Récupérer l'ID du patient depuis l'URL
      this.patientId = this.$route.params.id;
      // Appel de la méthode pour récupérer les informations du patient à modifier
      this.fetchPatientData();
    },
    methods: {
      fetchPatientData() {
        axios.get(`patient/patients/${this.patientId}/`) // Appel API pour récupérer les informations du patient
          .then(response => {
            const patient = response.data;
            // Mettre à jour les données du patient dans le formulaire
            this.nom = patient.nom;
            this.postNom = patient.post_nom; // Utilisation de post_nom
            this.prenom = patient.prenom;
            this.adresse = patient.adresse;
            this.genre = patient.genre;
            this.dateNaissance = patient.date_birth;
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des informations du patient à modifier :', error);
          });
      },
      submitForm() {
        const patientData = {
          nom: this.nom,
          post_nom: this.postNom, // Utilisation de post_nom
          prenom: this.prenom,
          adresse: this.adresse,
          genre: this.genre,
          date_birth: this.dateNaissance,
        };
  
        axios.put(`patient/patients/${this.patientId}/`, patientData) // Appel API pour mettre à jour les informations du patient
          .then(response => {
            console.log('Patient modifié avec succès :', response.data);
            // Redirection vers la liste des patients
            this.$router.push({ name: 'ListePatients' });
            // Affichage du message de succès
            alert('Patient modifié avec succès');
          })
          .catch(error => {
            console.error('Erreur lors de la modification du patient :', error);
            // Affichage de l'alerte d'erreur
            alert('Erreur lors de la modification du patient');
          });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez des styles personnalisés ici si nécessaire */
  </style>
  