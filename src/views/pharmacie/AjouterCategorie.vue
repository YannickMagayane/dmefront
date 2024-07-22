<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Categorie Medicament List</h1>
      <form @submit.prevent="addCategorie" class="mb-6">
        <div class="mb-4">
          <label for="nom" class="block text-gray-700 text-sm font-bold mb-2">Nom:</label>
          <input type="text" v-model="newCategorie.nom" id="nom" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Ajouter</button>
      </form>
  
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Nom</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="categorie in categories" :key="categorie.id" class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b">{{ categorie.nom }}</td>
            <td class="py-2 px-4 border-b">
              <button @click="editCategorie(categorie)" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline mr-2">Modifier</button><hr>
              <button @click="deleteCategorie(categorie.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline">Supprimer</button>
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
        categories: [],
        newCategorie: {
          nom: ''
        },
        editMode: false,
        editedCategorie: null
      };
    },
    created() {
      this.fetchCategories();
    },
    methods: {
      fetchCategories() {
        axios.get('http://127.0.0.1:8000/pharmacie/categories/')
          .then(response => {
            this.categories = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      addCategorie() {
        if (this.editMode) {
          axios.put(`http://127.0.0.1:8000/pharmacie/categories/${this.editedCategorie.id}/`, this.newCategorie)
            .then(() => {
              this.fetchCategories();
              this.newCategorie.nom = '';
              this.editMode = false;
              this.editedCategorie = null;
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          axios.post('http://127.0.0.1:8000/pharmacie/categories/', this.newCategorie)
            .then(response => {
              this.categories.push(response.data);
              this.newCategorie.nom = '';
            })
            .catch(error => {
              console.error(error);
            });
        }
      },
      editCategorie(categorie) {
        this.newCategorie.nom = categorie.nom;
        this.editMode = true;
        this.editedCategorie = categorie;
      },
      deleteCategorie(id) {
        axios.delete(`http://127.0.0.1:8000/pharmacie/categories/${id}/`)
          .then(() => {
            this.fetchCategories();
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
  }
  
  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
  }
  </style>
  