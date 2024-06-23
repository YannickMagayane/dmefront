<template>
    <div class="flex justify-center items-center h-screen bg-gray-100 print-container">
      <div class="card-wrapper">
        <div class="print-content">
          <div class="card-to-print zoomed">
            <h6 class="text-center">Carte Patient Clinique Universitaire Lubumbashi</h6>
            <div v-if="patient">
              <div class="qr-code-container">
                <img :src="patient.qr_code" alt="QR Code" class="qr-code" :style="{ width: '100%' }"/>
              </div>
              <div class="patient-info">
                <div class="info-item">
                  <h2>Code:</h2>
                  <p>{{ patient.code }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500">Aucun patient trouvé.</div>
          </div>
        </div>
        <button @click="imprimerCarte" class="print-button">
          Imprimer la carte
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '@/axios'; // Assurez-vous que le chemin d'importation est correct
  
  export default {
    name: 'CartePatient',
    data() {
      return {
        patient: null,
      };
    },
    mounted() {
      // Récupérer l'ID du patient depuis les paramètres de l'URL
      const patientId = this.$route.params.id;
      // Appeler la méthode pour récupérer les informations du patient
      this.fetchPatient(patientId);
    },
    methods: {
      fetchPatient(id) {
        // Faites une requête à l'API pour récupérer les informations du patient spécifique
        axios.get(`patient/patients/${id}/`)
          .then(response => {
            this.patient = response.data;
          })
          .catch(error => {
            console.error('Erreur lors de la récupération du patient :', error);
          });
      },
      imprimerCarte() {
        const printContent = document.querySelector('.print-content');
        const originalContents = document.body.innerHTML;
        const printContents = printContent.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles généraux */
  .print-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
    overflow: hidden; /* Masquer la barre de défilement */
  }
  
  .card-wrapper {
    position: relative;
  }
  
  .print-content {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

  
  .card-to-print {
    width: 85.6mm; /* Largeur d'une carte bancaire standard */
    height: 53.98mm; /* Hauteur d'une carte bancaire standard */
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
  }
  
  h1 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .qr-code-container {
    margin-bottom: 10px;
  }
  
  .qr-code {
    width: 80px; /* Agrandir le QR code */
    height: 80px;
    object-fit: contain;
  }
  
  .patient-info {
    margin-bottom: 10px;
  }
  .zoomed {
  transform: scale(2); /* Agrandir la carte à l'écran */
}
  .info-item h2 {
    font-size: 12px;
    margin: 0;
  }
  
  .info-item p {
    font-size: 12px;
    margin: 0;
  }
  
  .print-button {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1d4ed8;
    color: white;
    font-size: 20px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
  }
  
  .print-button:hover {
    background-color: #2563eb;
  }
  
  /* Styles d'impression */
  @media print {
    body * {
      visibility: hidden;
    }
  
    .print-content, .print-content * {
      visibility: visible;
    }
  
    .print-content {
      position: absolute;
      top: 0;
      left: 0;
    }
  
    .print-button {
      display: none; /* Masquer le bouton d'impression lors de l'impression */
    }
  }
  </style>
  