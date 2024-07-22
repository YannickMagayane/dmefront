<template>
    <div class="container mx-auto p-4">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h1 class="text-3xl font-bold mb-4 text-gray-700 text-center">Assigner des Examens</h1>
  
        <!-- Form for assigning multiple exams -->
        <form @submit.prevent="assignExams">
          <div v-for="(exam, index) in exams" :key="index" class="mb-4 border-b pb-4">
            <h2 class="text-xl font-semibold mb-2">Examen {{ index + 1 }}</h2>
            <div class="mb-4">
              <label for="examType" class="block text-gray-800 font-semibold mb-2">Type d'Examen</label>
              <input type="text" v-model="exam.type_examen" class="border rounded-lg px-3 py-2 w-full">
            </div>
            <div class="mb-4">
              <label for="description" class="block text-gray-800 font-semibold mb-2">Description</label>
              <textarea v-model="exam.description" class="border rounded-lg px-3 py-2 w-full" rows="4"></textarea>
            </div>
            <button @click="removeExam(index)" type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
              Supprimer cet Examen
            </button>
          </div>
          <button @click="addExam" type="button" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
            Ajouter un Examen
          </button>
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Assigner les Examens
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      consultationId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        exams: [
          {
            type_examen: '',
            description: '',
            consultation: this.consultationId, // Assignation de l'ID de consultation
          },
        ],
      };
    },
    methods: {
      addExam() {
        this.exams.push({
          type_examen: '',
          description: '',
          consultation: this.consultationId,
        });
      },
      removeExam(index) {
        this.exams.splice(index, 1);
      },
      assignExams() {
        // Reset the consultation ID for each exam to ensure it's correct
        this.exams.forEach(exam => {
          exam.consultation = this.consultationId;
        });
  
        // Submit each exam individually
        const requests = this.exams.map(exam =>
          axios.post('http://127.0.0.1:8000/consultation/examens-demandes/', exam)
        );
  
        axios.all(requests)
          .then(axios.spread((...responses) => {
            console.log('Tous les examens ont été assignés avec succès', responses);
            // Redirection vers ConsultationManager si succès
            this.$router.push({ name: 'ConsultationManager' });
          }))
          .catch(errors => {
            console.error('Erreur lors de l\'assignation des examens :', errors);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
  }
  
  label {
    font-weight: bold;
  }
  
  button {
    color: #fff;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  button:disabled:hover {
    background-color: #2563eb;
  }
  </style>
  