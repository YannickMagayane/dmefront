<template>
    <div class="register-container">
      <div class="register-card">
        <div class="info-section">
          <h2>INFORMATION</h2>
          <p>Ce système est une plateforme de gestion des patients électronique conçue pour la clinique universitaire de Lubumbashi.</p>
          <button @click="$router.push('/register')">Je n'ai pas de compte</button>
        </div>
        <div class="register-form">
          <h1>Connexion Utilisateur</h1>
          <div v-if="errorMessage" class="error-message">
            <p>{{ errorMessage }}</p>
          </div>      
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" v-model="email" id="email" required />
            </div>
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input type="password" v-model="password" id="password" required />
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition duration-300">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    decodeToken(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    },
    async login() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/user/login/', {
          email: this.email,
          password: this.password
        });

        const token = response.data.access_token;
        const decodedToken = this.decodeToken(token);

        if (!decodedToken) {
          this.errorMessage = "Erreur lors du décodage du token.";
          return;
        }

        const userId = decodedToken.user_id;

        // Fetch affectation data using the user ID from the token
        const affectationResponse = await axios.get(`http://127.0.0.1:8000/patient/affectations/?email=${userId}`);
        const userAffectation = affectationResponse.data.find(affectation => affectation.email === userId);

        if (!userAffectation) {
          this.errorMessage = "Utilisateur inexistant.";
        } else if (!userAffectation.is_approuve) {
          this.errorMessage = "Votre compte n'a pas encore été approuvé.";
        } else if (!userAffectation.affectation) {
          this.errorMessage = "Vous n'avez pas encore été affecté.";
        } else {
          this.errorMessage = "";
          localStorage.setItem('token', token);

          // Redirection en fonction de l'affectation
          if (userAffectation.affectation === 'reception') {
            this.$router.push('/patients'); // Redirection vers la liste des patients
          } else if (userAffectation.affectation === 'ssi') {
            this.$router.push('/gestion-ssi'); // Redirection vers la gestion SSI
          } else if (userAffectation.affectation === 'consultation') {
            this.$router.push('/patients-sans-consultation'); // Redirection vers patients sans consultation
          } else {
            // Ajoutez d'autres redirections en fonction des autres affectations si nécessaire
            // Par exemple, this.$router.push('/autre-route');
          }
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.errorMessage = "Erreur de connexion. Veuillez vérifier vos identifiants.";
      }
    }
  }
};
</script>

  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f9;
  }
  
  .register-card {
    display: flex;
    max-width: 800px;
    margin: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .info-section {
    background-color: #007bff;
    color: #fff;
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .info-section h2 {
    margin-bottom: 20px;
  }
  
  .info-section p {
    margin-bottom: 20px;
  }
  
  .info-section button {
    background-color: #fff;
    color: #007bff;
    border: none;
    border-radius: 3px;
    padding: 10px 20px;
    cursor: pointer;
  }
  
  .register-form {
    flex: 1;
    padding: 20px;
  }
  
  .register-form h1 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: bold;
  }
  
  .form-group input {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 14px;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px 0;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error-message {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid red;
    border-radius: 3px;
    background-color: #f8d7da;
    color: #721c24;
    text-align: center;
  }
  </style>
  