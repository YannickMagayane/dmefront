<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold my-4 text-center text-gray-700">Liste des Consultations</h1>

    <!-- Tableau des consultations -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="max-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptômes</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnostic</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="consultation in paginatedConsultations" :key="consultation.id" class="hover:bg-gray-100 cursor-pointer">
            <td @click="viewPatientDetails(consultation.patient)" class="px-6 py-4 whitespace-nowrap cursor-pointer">
              <router-link :to="{ name: 'ConsultDetail', params: { patientId: consultation.patient } }" class="text-blue-500 hover:underline">
                {{ getPatientName(consultation.patient) }}
              </router-link>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ consultation.symptomes }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ consultation.diagnostic }}</td>

            <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
              <router-link :to="{ name: 'AssignMedicament', params: { consultationId: consultation.patient } }">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Assigner un médicament
                </button>
              </router-link>
              <router-link :to="{ name: 'AssignExamen', params: { consultationId: consultation.patient } }">
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Assigner un Examen
                </button>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-4 space-x-2">
      <button @click="previousPage" :disabled="currentPage === 1" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed">
        Précédent
      </button>
      <button @click="nextPage" :disabled="currentPage * pageSize >= consultations.length" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed">
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      consultations: [],
      patients: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    paginatedConsultations() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.consultations.slice(startIndex, startIndex + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.consultations.length / this.pageSize);
    },
  },
  mounted() {
    this.fetchConsultations();
    this.fetchPatients();
  },
  methods: {
    fetchConsultations() {
      axios.get('http://127.0.0.1:8000/consultation/consultations/')
        .then(response => {
          this.consultations = response.data.sort((a, b) => new Date(b.date_consultation) - new Date(a.date_consultation)); // Trie par date de consultation décroissante
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des consultations :', error);
        });
    },
    fetchPatients() {
      axios.get('http://127.0.0.1:8000/patient/patients/')
        .then(response => {
          this.patients = response.data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des patients :', error);
        });
    },
    getPatientName(patientId) {
      const patient = this.patients.find(p => p.id === patientId);
      return patient ? `${patient.nom} ${patient.post_nom} ${patient.prenom}` : '';
    },
    viewPatientDetails(patientId) {
      this.$router.push({ name: 'ConsultDetail', params: { patientId } });
    },
    startAutoCheckLoginStatus() {
      setInterval(this.checkLoginStatus, 1000); // Auto-check login status every 30 seconds
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage * this.pageSize < this.consultations.length) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1500px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f8fafc;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background-color: #edf2f7;
  color: #4a5568;
  font-weight: 600;
}

tbody tr:hover {
  background-color: #f7fafc;
}

a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  text-decoration: none;
  color: inherit;
}

.flex {
  display: flex;
  justify-content: space-between;
}

button {
  color: #fff;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: #2563eb;
}

/* Ajout des deux récentes modifications en couleur rouge */
.router-link-red {
  background-color: #ff4d4f;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-align: center;
  display: inline-block;
  font-weight: bold;
}

.router-link-red:hover {
  background-color: #ff7875;
}
</style>
