<template>
  <div>
    <!-- Modal for Creating/Updating Affectation -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeForm">&times;</span>
        <h2 class="text-center font-bold">{{ isEditing ? 'Modifier' : 'Ajouter' }} une affectation</h2>
        <form @submit.prevent="isEditing ? updateAffectation() : submitAffectation()" class="affectation-form styled-form">
          
          <div class="form-group">
            <input type="email" v-model="selectedUserEmail" placeholder="Email" required list="users">
            <datalist id="users">
              <option v-for="user in users" :key="user.id" :value="user.email">{{ user.email }}</option>
            </datalist>
          </div>
          <div class="form-group">
            <select v-model="affectation.poste" required>
              <option value="" disabled selected>Choisir le poste</option>
              <option v-for="poste in typePoste" :key="poste.value" :value="poste.value">
                {{ poste.text }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <select v-model="affectation.affectation" required>
              <option value="" disabled selected>Choisir l'affectation</option>
              <option v-for="aff in typeAffectation" :key="aff.value" :value="aff.value">
                {{ aff.text }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="affectation.is_approuve">
              Approuvé
            </label>
          </div>
          
          <button type="submit" class="btn-submit">{{ isEditing ? 'Modifier' : 'Ajouter' }}</button>
        </form>
      </div>
    </div>

    <!-- User List and Create Affectation Button -->
    <div class="user-list">
      <h2 class="text-center font-bold mb-4">Liste des Affectations</h2><br>
      <div class="create-affectation flex justify-end"><br>
        <button @click="openForm(false)" class="create-affectation-btn small">Créer Affectation</button>
      </div>
      <table class="table-auto">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-4 py-2">Utilisateur</th>
            <th class="border px-4 py-2">Poste</th>
            <th class="border px-4 py-2">Affectation</th>
            <th class="border px-4 py-2">Approuvé</th>
            <th class="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="affectation in affectations" :key="affectation.id" class="border-b">
            <td class="border px-4 py-2">{{ getUserFullName(affectation.email) }}</td>
            <td class="border px-4 py-2">{{ affectation.poste }}</td>
            <td class="border px-4 py-2">{{ affectation.affectation }}</td>
            <td class="border px-4 py-2">{{ affectation.is_approuve ? 'Oui' : 'Non' }}</td>
            <td class="border px-4 py-2">
              <button @click="openForm(true, affectation.id)" class="btn-secondary small">Modifier</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';

export default {
  name: 'UserAffectation',
  data() {
    return {
      showForm: false,
      isEditing: false,
      affectation: {
        poste: '',
        affectation: '',
        is_approuve: false,
        email: '',
      },
      affectations: [],
      users: [],
      typePoste: [
        { value: 'medecin_directeur', text: 'Médecin Directeur' },
        { value: 'infirmier_titulaire', text: 'Infirmier Titulaire' },
        { value: 'medecin', text: 'Médecin' },
        { value: 'infirmier', text: 'Infirmier' },
        { value: 'receptioniste', text: 'Réceptioniste' },
        { value: 'pharmacien', text: 'Pharmacien' },
        { value: 'laboratin', text: 'Laboratin' },
        { value: 'stagiaire', text: 'Stagiaire' },
        { value: 'medecin_visiteur', text: 'Médecin Visiteur' }
      ],
      typeAffectation: [
        { value: 'consultation', text: 'Consultation' },
        { value: 'reception', text: 'Réception' },
        { value: 'laboratoire', text: 'Laboratoire' },
        { value: 'hospitalisation', text: 'Hospitalisation' },
        { value: 'pharmacie', text: 'Pharmacie' },
        { value: 'ssi', text: 'SSI' }
      ],
      selectedUserEmail: ''
    };
  },
  computed: {
    selectedUserId() {
      const selectedUser = this.users.find(user => user.email === this.selectedUserEmail);
      return selectedUser ? selectedUser.id : '';
    }
  },
  methods: {
    fetchAffectations() {
      axios.get('http://127.0.0.1:8000/patient/affectations/')
        .then(response => {
          this.affectations = response.data;
          this.fetchUsers();
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des affectations :', error);
        });
    },
    fetchUsers() {
      axios.get('http://127.0.0.1:8000/user/users/')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des utilisateurs :', error);
        });
    },
    submitAffectation() {
      if (!this.selectedUserId) {
        console.error('Veuillez sélectionner un utilisateur valide.');
        return;
      }

      this.affectation.email = this.selectedUserId; // Utilisez l'id de l'utilisateur

      axios.post('http://127.0.0.1:8000/patient/affectations/', this.affectation)
        .then(response => {
          console.log('Affectation ajoutée avec succès!', response.data);
          this.resetForm();
          router.push('/user'); // Naviguer vers la route de votre liste d'affectations

        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout de l\'affectation :', error);
          console.log(error.response.data);
        });
    },

    updateAffectation() {
      if (!this.selectedUserId) {
        console.error('Veuillez sélectionner un utilisateur valide.');
        return;
      }

      this.affectation.email = this.selectedUserId; // Utilisez l'id de l'utilisateur

      axios.put(`http://127.0.0.1:8000/patient/affectations/${this.affectation.id}/`, this.affectation)
        .then(response => {
          console.log('Affectation modifiée avec succès!', response.data);
          this.resetForm();
          router.push('/user'); 

        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour de l\'affectation :', error);
          console.log(error.response.data);
        });
    },

    getUserFullName(userId) {
      const user = this.users.find(user => user.id === userId);
      if (user) {
        return `${user.first_name} ${user.last_name}`;
      } else {
        return 'Utilisateur inconnu';
      }
    },
    refreshAffectations() {
      setInterval(() => {
        this.fetchAffectations(); // Fetch affectations data every 3 seconds
      }, 1000);
    },

    openForm(isEditing, affectationId = null) {
      this.isEditing = isEditing;
      if (isEditing) {
        axios.get(`http://127.0.0.1:8000/patient/affectations/${affectationId}/`)
          .then(response => {
            this.affectation = response.data;
            const selectedUser = this.users.find(user => user.id === this.affectation.email);
            if (selectedUser) {
              this.selectedUserEmail = selectedUser.email;
            }
            this.showForm = true;
          })
          .catch(error => {
            console.error('Erreur lors de la récupération de l\'affectation à modifier :', error);
          });
      } else {
        this.affectation = {
          poste: '',
          affectation: '',
          is_approuve: false,
          email: ''
        };
        this.selectedUserEmail = '';
        this.showForm = true;
      }
    },
    closeForm() {
      this.resetForm();
      this.showForm = false;
    },
    resetForm() {
      this.affectation = {
        poste: '',
        affectation: '',
        is_approuve: false,
        email: ''
      };
      this.selectedUserEmail = '';
    }
  },
  mounted() {
    this.fetchAffectations();
    this.refreshAffectations(); // Start refreshing affectations every 3 seconds
  }
};
</script>

<style scoped>
/* Global Styles */
.table-auto {
  width: 100%;
  border-collapse: collapse;
}

.table-auto th, .table-auto td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table-auto th {
  background-color: #f2f2f2;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #333;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.small {
  padding: 0.5rem 1rem;
}

.create-affectation {
  margin-bottom: 1rem;
}

.create-affectation-btn {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.create-affectation-btn:hover {
  background-color: #45a049;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
}

.styled-form .form-group {
  margin-bottom: 15px;
}

.styled-form input,
.styled-form select,
.styled-form textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.create-affectation {
  position: absolute;
  top: 100px;
  right: 10px;
}

.create-affectation-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #008CBA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-affectation-btn:hover {
  background-color: #005f6b;
}

.styled-form input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.styled-form .checkbox-label {
  display: flex;
  align-items: center;
}

.styled-form .btn-submit {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.styled-form .btn-submit:hover {
  background-color: #45a049;
}

.user-list {
  margin: 2rem 0;
}
</style>
