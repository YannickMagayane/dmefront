<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des Médicaments</h1>
      <form @submit.prevent="addMedicament" class="mb-6">
        <div class="mb-4">
          <label for="nom" class="block text-gray-700 text-sm font-bold mb-2">Nom:</label>
          <input type="text" v-model="newMedicament.nom" id="nom" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-4">
          <label for="categorie" class="block text-gray-700 text-sm font-bold mb-2">Catégorie:</label>
          <select v-model="newMedicament.categorie" id="categorie" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option v-for="categorie in categories" :key="categorie.id" :value="categorie.id">{{ categorie.nom }}</option>
          </select>
        </div>
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Ajouter</button>
      </form>
  
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Nom</th>
            <th class="py-2 px-4 border-b">Catégorie</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="medicament in medicaments" :key="medicament.id" class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b text-center">{{ medicament.nom }}</td>
            <td class="py-2 px-4 border-b text-center">{{ getNomCategorie(medicament.categorie) }}</td>
            <td class="py-2 px-4 border-b">
              <button @click="editMedicament(medicament)" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline mr-2">Modifier</button><hr>
              <button @click="deleteMedicament(medicament.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        medicaments: [],
        categories: [],
        newMedicament: {
          nom: '',
          categorie: '',
          categorie_nom: ''  // Champ pour stocker temporairement le nom de la catégorie
        },
        editMode: false,
        editedMedicament: null
      };
    },
    created() {
      this.fetchMedicaments();
      this.fetchCategories();
    },
    methods: {
      fetchMedicaments() {
        axios.get('http://127.0.0.1:8000/pharmacie/medicament/')
          .then(response => {
            this.medicaments = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      fetchCategories() {
        axios.get('http://127.0.0.1:8000/pharmacie/categories/')
          .then(response => {
            this.categories = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      addMedicament() {
        if (this.editMode) {
          axios.put(`http://127.0.0.1:8000/pharmacie/medicament/${this.editedMedicament.id}/`, {
            nom: this.newMedicament.nom,
            categorie: this.newMedicament.categorie  // Envoyer directement l'ID de la catégorie
          })
            .then(() => {
              this.fetchMedicaments();
              this.newMedicament.nom = '';
              this.newMedicament.categorie = '';
              this.editMode = false;
              this.editedMedicament = null;
            })
            .catch(error => {
              console.error('Erreur lors de la modification du médicament :', error.response.data);
            });
        } else {
          axios.post('http://127.0.0.1:8000/pharmacie/medicament/', {
            nom: this.newMedicament.nom,
            categorie: this.newMedicament.categorie  // Envoyer directement l'ID de la catégorie
          })
            .then(response => {
              this.medicaments.push(response.data);
              this.newMedicament.nom = '';
              this.newMedicament.categorie = '';
            })
            .catch(error => {
              console.error('Erreur lors de l\'ajout du médicament :', error.response.data);
            });
        }
      },
      editMedicament(medicament) {
        this.newMedicament.nom = medicament.nom;
        this.newMedicament.categorie = medicament.categorie.id;  // Utiliser l'ID de la catégorie
        this.newMedicament.categorie_nom = medicament.categorie.nom;  // Récupérer le nom de la catégorie
        this.editMode = true;
        this.editedMedicament = medicament;
      },
      deleteMedicament(id) {
        axios.delete(`http://127.0.0.1:8000/pharmacie/medicament/${id}/`)
          .then(() => {
            this.fetchMedicaments();
          })
          .catch(error => {
            console.error(error);
          });
      },
      getNomCategorie(categorieId) {
        const categorie = this.categories.find(cat => cat.id === categorieId);
        return categorie ? categorie.nom : '';
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  
  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
  }
  </style>
  