<template>
  <div>
    <h1 class="text-3xl font-bold my-4 text-center">Liste des patients</h1>
    <div v-if="patients.length === 0" class="text-gray-500 text-center">Aucun patient trouvé.</div>
    <div v-else>
      <!-- Ajout des boutons "Créer Patient", "Modifier" et "Voir Carte" avec des icônes -->
      <div class="flex justify-end mb-4 mr-4">
        <router-link to="/create-patient" class="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          <span class="mr-2"><i data-feather="user-plus"></i></span>
          Créer Patient
        </router-link>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-100 border-b border-gray-300">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">Nom</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">Post-Nom</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">Prénom</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">Adresse</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">Genre</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">Âge</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">Code</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="patient in sortedPatients" :key="patient.id" class="hover:bg-gray-100">
              <td class="px-6 py-4 whitespace-nowrap">{{ patient.nom }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ patient.postNom }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ patient.prenom }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ patient.adresse }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ patient.genre }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="patient.ageEnAnnees">{{ patient.ageEnAnnees }} ans</span>
                <span v-else>{{ patient.ageEnMois }} mois</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ patient.code }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link :to="{ name: 'ModifierPatient', params: { id: patient.id }}" class="text-blue-500 hover:text-blue-700 font-bold mr-2">
                  <i data-feather="edit"></i>
                  Modifier 
                </router-link>
                <router-link :to="{ name: 'CartePatient', params: { id: patient.id } }" class="text-green-500 hover:text-green-700 font-bold">
                  <i data-feather="eye"></i>
                  Voir Carte
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'; 

export default {
  name: 'ListePatients',
  data() {
    return {
      patients: [], // Initialisez la liste des patients avec une liste vide
    };
  },
  mounted() {
    // Appel de la méthode pour récupérer tous les patients
    this.fetchPatients();
  },
  computed: {
    sortedPatients() {
      // Trier les patients par ordre décroissant d'ID
      return this.patients.slice().sort((a, b) => b.id - a.id);
    },
  },
  methods: {
    fetchPatients() {
      axios.get('patient/patients/') // Utilisation de l'URL relative, car baseURL est déjà défini dans axios.js
        .then(response => {
          // Mettre à jour la liste des patients avec les données reçues de l'API
          this.patients = response.data.map(patient => ({
            id: patient.id, // Assurez-vous que votre API renvoie l'ID du patient
            nom: patient.nom,
            postNom: patient.post_nom,
            prenom: patient.prenom,
            adresse: patient.adresse,
            genre: patient.genre,
            ageEnMois: patient.age_en_mois,
            ageEnAnnees: patient.age_en_annees,
            code: patient.code,
          }));
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des patients :', error);
        });
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles personnalisés ici si nécessaire */
/* Style pour la pagination à 10 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
}

.pagination button:hover {
  background-color: #3574ca;
}

/* Style pour le hover sur les lignes du tableau */
tbody tr:hover {
  background-color: #f7fafc;
}
</style>
