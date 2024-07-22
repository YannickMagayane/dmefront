<template>
    <div class="p-8 bg-gray-100 min-h-screen relative">
      <h1 class="text-3xl font-bold mb-6 text-center">Gestion des Stocks</h1>
  
      <!-- Bouton Ajouter positionné à droite -->
      <!-- Bouton Ajouter positionné à droite -->
    <button @click="showCreateForm = true" 
            class=" top-4 right-4 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      Ajouter
    </button>
  
      <!-- Formulaire pour créer ou modifier un stock -->
      <div v-if="showCreateForm" class="overlay">
        <form @submit.prevent="editingStock ? updateStock() : createStock()" 
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded-lg shadow-md transition-transform duration-300 z-10">
          <h2 class="text-xl font-bold mb-4 text-center">Résumé</h2>
          <div class="mb-4">
            <label for="quantite" class="block text-gray-700">Quantité</label>
            <input type="number" v-model="quantite" required 
                   class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div class="mb-4">
            <label for="date_entree" class="block text-gray-700">Date d'entrée</label>
            <input type="date" v-model="date_entree" required 
                   class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div class="mb-4">
            <label for="prix_unitaire" class="block text-gray-700">Prix unitaire</label>
            <input type="number" step="0.01" v-model="prix_unitaire" required 
                   class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div class="mb-4">
            <label for="medicament" class="block text-gray-700">Médicament</label>
            <input list="medicaments" v-model="selectedMedicamentName" @input="filterMedicaments" required 
                   class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            <datalist id="medicaments">
              <option v-for="medicament in filteredMedicaments" :key="medicament.id" :value="medicament.nom" @click="selectMedicament(medicament)"></option>
            </datalist>
          </div>
          <button type="submit" 
                  class="w-full py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {{ editingStock ? 'Modifier' : 'Ajouter' }} Stock
          </button>
          <button type="button" @click="cancelEdit" 
                  class="w-full mt-4 py-2 px-3 bg-red-600 text-white rounded-md hover:bg-red-700">
            Annuler
          </button>
        </form>
      </div>
  
      <!-- Tableau pour afficher la liste des stocks -->
      <div class="mt-8 overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead class="bg-gray-800 text-white">
            <tr>
              
              <th class="py-2 px-4">Quantité</th>
              <th class="py-2 px-4">Date d'entrée</th>
              <th class="py-2 px-4">Prix unitaire</th>
              <th class="py-2 px-4">Médicament</th>
              <th class="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stock in stocks" :key="stock.id" class="hover:bg-gray-100 transition-colors duration-300">
              <td class="py-2 px-4 text-center">{{ stock.quantite }}</td>
              <td class="py-2 px-4 text-center">{{ stock.date_entree }}</td>
              <td class="py-2 px-4 text-center">{{ stock.prix_unitaire }}</td>
              <td class="py-2 px-4 text-center">{{ getMedicamentName(stock.medicament) }}</td>
              <td class="py-2 px-4 text-center">
                <button @click="editStock(stock.id)" 
                        class="py-1 px-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2">
                  Modifier
                </button><hr>
                <button @click="confirmDelete(stock.id)" 
                        class="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Confirmation de suppression -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 hover:bg-opacity-90">
          <p class="text-gray-700 mb-4">Êtes-vous sûr de vouloir supprimer ce stock ?</p>
          <div class="flex justify-end">
            <button @click="deleteStock(deleteStockId)" 
                    class="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 mr-2">
              Oui
            </button>
            <button @click="showDeleteConfirm = false" 
                    class="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Non
            </button>
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
        stocks: [],
        medicaments: [],
        filteredMedicaments: [],
        newStock: {
          quantite: '',
          date_entree: '',
          prix_unitaire: '',
          medicament: ''
        },
        currentStock: {},
        selectedMedicamentName: '',
        showCreateForm: false,
        editingStock: false,
        showDeleteConfirm: false,
        deleteStockId: null
      };
    },
    created() {
      this.fetchStocks();
      this.fetchMedicaments();
    },
    computed: {
      quantite: {
        get() {
          return this.editingStock ? this.currentStock.quantite : this.newStock.quantite;
        },
        set(value) {
          if (this.editingStock) {
            this.currentStock.quantite = value;
          } else {
            this.newStock.quantite = value;
          }
        }
      },
      date_entree: {
        get() {
          return this.editingStock ? this.currentStock.date_entree : this.newStock.date_entree;
        },
        set(value) {
          if (this.editingStock) {
            this.currentStock.date_entree = value;
          } else {
            this.newStock.date_entree = value;
          }
        }
      },
      prix_unitaire: {
        get() {
          return this.editingStock ? this.currentStock.prix_unitaire : this.newStock.prix_unitaire;
        },
        set(value) {
          if (this.editingStock) {
            this.currentStock.prix_unitaire = value;
          } else {
            this.newStock.prix_unitaire = value;
          }
        }
      }
    },
    methods: {
      fetchStocks() {
        axios.get('http://127.0.0.1:8000/pharmacie/stocks/')
          .then(response => {
            this.stocks = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      fetchMedicaments() {
        axios.get('http://127.0.0.1:8000/pharmacie/medicament/')
          .then(response => {
            this.medicaments = response.data;
            this.filteredMedicaments = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      createStock() {
        this.newStock.medicament = this.medicaments.find(m => m.nom === this.selectedMedicamentName).id;
        axios.post('http://127.0.0.1:8000/pharmacie/stocks/', this.newStock)
          .then(() => {
            this.fetchStocks();
            this.resetForm();
          })
          .catch(error => {
            console.error(error);
          });
      },
      editStock(id) {
        const stock = this.stocks.find(s => s.id === id);
        this.currentStock = { ...stock };
        this.selectedMedicamentName = this.getMedicamentName(stock.medicament);
        this.editingStock = true;
        this.showCreateForm = true; // Affiche le formulaire lors de l'édition
      },
      updateStock() {
        this.currentStock.medicament = this.medicaments.find(m => m.nom === this.selectedMedicamentName).id;
        axios.put(`http://127.0.0.1:8000/pharmacie/stocks/${this.currentStock.id}/`, this.currentStock)
          .then(() => {
            this.fetchStocks();
            this.resetForm();
          })
          .catch(error => {
            console.error(error);
          });
      },
      confirmDelete(id) {
        this.deleteStockId = id;
        this.showDeleteConfirm = true;
      },
      deleteStock(id) {
        axios.delete(`http://127.0.0.1:8000/pharmacie/stocks/${id}/`)
          .then(() => {
            this.fetchStocks();
            this.showDeleteConfirm = false;
          })
          .catch(error => {
            console.error(error);
          });
      },
      getMedicamentName(medicamentId) {
        const medicament = this.medicaments.find(m => m.id === medicamentId);
        return medicament ? medicament.nom : '';
      },
      selectMedicament(medicament) {
        this.newStock.medicament = medicament.id;
      },
      filterMedicaments() {
        this.filteredMedicaments = this.medicaments.filter(m => m.nom.toLowerCase().includes(this.selectedMedicamentName.toLowerCase()));
      },
      resetForm() {
        this.newStock = {
          quantite: '',
          date_entree: '',
          prix_unitaire: '',
          medicament: ''
        };
        this.selectedMedicamentName = '';
        this.editingStock = false;
        this.showCreateForm = false;
      },
      cancelEdit() {
        this.resetForm();
      }
    }
  };
  </script>
  
  <style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
  </style>
  