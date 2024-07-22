<template>
    <div class="container">
      <div class="header">
        <h1>Gestion des Ventes</h1>
      </div>
      
      <div class="main-content">
        <!-- Formulaire pour créer ou modifier une vente -->
        <form class="sale-form" @submit.prevent="editingSale ? updateSale() : createSale()">
          <div class="form-group">
            <label for="quantite">Quantité</label>
            <input type="number" v-model="quantite" required />
          </div>
          <div class="form-group">
            <label for="date_vente">Date de vente</label>
            <input type="date" v-model="date_vente" required />
          </div>
          <div class="form-group">
            <label for="medicament">Médicament</label>
            <input list="medicaments" v-model="selectedMedicamentName" @input="filterMedicaments" @change="setMedicamentId" required />
            <datalist id="medicaments">
              <option v-for="medicament in filteredMedicaments" :key="medicament.id" :value="medicament.nom" :data-id="medicament.id"></option>
            </datalist>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn primary">{{ editingSale ? 'Modifier' : 'Ajouter' }} Vente</button>
            <button type="button" class="btn secondary" @click="cancelEdit" v-if="editingSale">Annuler</button>
          </div>
        </form>
      
        <!-- Tableau pour afficher la liste des ventes -->
        <table class="sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quantité</th>
              <th>Date de vente</th>
              <th>Montant total</th>
              <th>Médicament</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sortedSales" :key="sale.id">
              <td>{{ sale.id }}</td>
              <td>{{ sale.quantite }}</td>
              <td>{{ sale.date_vente }}</td>
              <td>{{ sale.montant_total }}</td>
              <td>{{ getMedicamentName(sale.medicament) }}</td>
              <td>
                <button class="btn edit" @click="editSale(sale.id)">Modifier</button>
                <button class="btn delete" @click="confirmDelete(sale.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Confirmation de suppression -->
      <div class="delete-confirm" v-if="showDeleteConfirm">
        <p>Êtes-vous sûr de vouloir supprimer cette vente ?</p>
        <button class="btn confirm" @click="deleteSale(deleteSaleId)">Oui</button>
        <button class="btn cancel" @click="showDeleteConfirm = false">Non</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        sales: [],
        medicaments: [],
        filteredMedicaments: [],
        newSale: {
          quantite: '',
          date_vente: '',
          montant_total: '',
          medicament: ''
        },
        currentSale: {},
        selectedMedicamentName: '',
        selectedMedicamentId: null,
        editingSale: false,
        showDeleteConfirm: false,
        deleteSaleId: null
      };
    },
    created() {
      this.fetchSales();
      this.fetchMedicaments();
    },
    computed: {
      quantite: {
        get() {
          return this.editingSale ? this.currentSale.quantite : this.newSale.quantite;
        },
        set(value) {
          if (this.editingSale) {
            this.currentSale.quantite = value;
          } else {
            this.newSale.quantite = value;
          }
        }
      },
      date_vente: {
        get() {
          return this.editingSale ? this.currentSale.date_vente : this.newSale.date_vente;
        },
        set(value) {
          if (this.editingSale) {
            this.currentSale.date_vente = value;
          } else {
            this.newSale.date_vente = value;
          }
        }
      },
      montant_total: {
        get() {
          return this.editingSale ? this.currentSale.montant_total : this.newSale.montant_total;
        },
        set(value) {
          if (this.editingSale) {
            this.currentSale.montant_total = value;
          } else {
            this.newSale.montant_total = value;
          }
        }
      },
      sortedSales() {
        return this.sales.slice().sort((a, b) => new Date(b.date_vente) - new Date(a.date_vente));
      }
    },
    methods: {
      fetchSales() {
        axios.get('http://127.0.0.1:8000/pharmacie/ventes/')
          .then(response => {
            this.sales = response.data;
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
      createSale() {
        if (!this.newSale.quantite || !this.newSale.date_vente || !this.selectedMedicamentId) {
          alert("Les champs quantité, date de vente et médicament sont obligatoires.");
          return;
        }
  
        this.newSale.medicament = this.selectedMedicamentId;
        this.fetchMontant(this.selectedMedicamentId)
          .then(montant_unitaire => {
            this.newSale.montant_total = montant_unitaire * this.newSale.quantite;
            axios.post('http://127.0.0.1:8000/pharmacie/ventes/', this.newSale)
              .then(response => {
                console.log("Response:", response);
                this.fetchSales();
                this.resetForm();
              })
              .catch(error => {
                console.error("Erreur lors de la création de la vente:", error.response ? error.response.data : error);
                alert("Une erreur est survenue lors de la création de la vente.");
              });
          });
      },
      fetchMontant(medicamentId) {
        return new Promise((resolve, reject) => {
          const medicament = this.medicaments.find(m => m.id === medicamentId);
          if (medicament) {
            resolve(medicament.prix_unitaire);
          } else {
            reject("Médicament non trouvé");
          }
        });
      },
      setMedicamentId(event) {
        const selectedOption = Array.from(event.target.list.options).find(option => option.value === event.target.value);
        if (selectedOption) {
          this.selectedMedicamentId = Number(selectedOption.getAttribute('data-id'));
        } else {
          this.selectedMedicamentId = null;
        }
      },
      filterMedicaments() {
        this.filteredMedicaments = this.medicaments.filter(medicament =>
          medicament.nom.toLowerCase().includes(this.selectedMedicamentName.toLowerCase())
        );
      },
      getMedicamentName(medicamentId) {
        const medicament = this.medicaments.find(m => m.id === medicamentId);
        return medicament ? medicament.nom : 'Inconnu';
      },
      resetForm() {
        this.newSale = {
          quantite: '',
          date_vente: '',
          montant_total: '',
          medicament: ''
        };
        this.selectedMedicamentName = '';
        this.selectedMedicamentId = null;
        this.editingSale = false;
        this.currentSale = {};
      },
      editSale(id) {
        const sale = this.sales.find(s => s.id === id);
        if (sale) {
          this.currentSale = { ...sale };
          this.selectedMedicamentId = sale.medicament;
          this.selectedMedicamentName = this.getMedicamentName(sale.medicament);
          this.editingSale = true;
        }
      },
      updateSale() {
        if (!this.currentSale.quantite || !this.currentSale.date_vente || !this.selectedMedicamentId) {
          alert("Les champs quantité, date de vente et médicament sont obligatoires.");
          return;
        }
  
        this.currentSale.medicament = this.selectedMedicamentId;
        this.fetchMontant(this.selectedMedicamentId)
          .then(montant_unitaire => {
            this.currentSale.montant_total = montant_unitaire * this.currentSale.quantite;
            axios.put(`http://127.0.0.1:8000/pharmacie/ventes/${this.currentSale.id}/`, this.currentSale)
              .then(response => {
                console.log("Response:", response);
                this.fetchSales();
                this.resetForm();
              })
              .catch(error => {
                console.error("Erreur lors de la mise à jour de la vente:", error.response ? error.response.data : error);
                alert("Une erreur est survenue lors de la mise à jour de la vente.");
              });
          });
      },
      confirmDelete(id) {
        this.showDeleteConfirm = true;
        this.deleteSaleId = id;
      },
      deleteSale(id) {
        axios.delete(`http://127.0.0.1:8000/pharmacie/ventes/${id}/`)
          .then(response => {
            console.log("Response:", response);
            this.fetchSales();
            this.showDeleteConfirm = false;
            this.deleteSaleId = null;
          })
          .catch(error => {
            console.error("Erreur lors de la suppression de la vente:", error.response ? error.response.data : error);
            alert("Une erreur est survenue lors de la suppression de la vente.");
          });
      },
      cancelEdit() {
        this.resetForm();
      }
    }
  };
  </script>

  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f4f4f4;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .header {
    width: 100%;
    text-align: center;
    background-color: #0078d7;
    color: white;
    padding: 10px 0;
  }
  
  .main-content {
    display: flex;
    flex-direction: column;
    width: 80%;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .sale-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  
  .form-group label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn.primary {
    background-color: #0078d7;
    color: white;
  }
  
  .btn.secondary {
    background-color: #e2e2e2;
    color: black;
  }
  
  .btn.edit {
    background-color: #ffcc00;
  }
  
  .btn.delete {
    background-color: #d9534f;
    color: white;
  }
  
  .sales-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .sales-table th, .sales-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .sales-table th {
    background-color: #f2f2f2;
  }
  
  .delete-confirm {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .delete-confirm p {
    margin-bottom: 20px;
  }
  
  .delete-confirm .btn.confirm {
    background-color: #d9534f;
    color: white;
  }
  
  .delete-confirm .btn.cancel {
    background-color: #e2e2e2;
    color: black;
  }
  </style>
  