<template>
      <div class="register-container">

  <div class="register-card">
    <div class="info-section">
      <h2>INFORMATION</h2>
      <p>Ce système est une plateforme de gestion des patients électronique conçue pour la clinique universitaire de Lubumbashi.</p>
      <button @click="$router.push('/')">J'ai un compte</button>
    </div>
    <div class="register-form">
      <h1>Enregistrement des Utilisateurs</h1>
      <div v-if="successMessage" class="success-message">
        <p>✅ Utilisateur enregistré avec succès ! Vous pouvez vous connecter.</p>
      </div>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="first_name">Nom</label>
          <input type="text" v-model="first_name" id="first_name" required />
        </div>
        <div class="form-group">
          <label for="last_name">Post-Nom</label>
          <input type="text" v-model="last_name" id="last_name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <div class="form-group">
          <label for="password_confirm">Confirmer mot de passe</label>
          <input type="password" v-model="password_confirm" id="password_confirm" required />
        </div>
        <div class="form-group">
          <input type="checkbox" id="terms" required />
          <label for="terms">Accepter les conditions des confidentialités </label>
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition duration-300">S'inscrire</button>
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
      password_confirm: '',
      first_name: '',
      last_name: '',
      successMessage: false,
    };
  },
  methods: {
    async register() {
      if (this.password !== this.password_confirm) {
        alert("Les mots de passe ne correspondent pas !");
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/user/register/', {
          email: this.email,
          password: this.password,
          password_confirm: this.password_confirm,
          first_name: this.first_name,
          last_name: this.last_name
        });
        console.log(response.data);
        this.successMessage = true;
        setTimeout(() => {
          this.$router.push('/');
        }, 2000); // Redirection après 2 secondes
      } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        if (error.response) {
          console.error("Données de réponse :", error.response.data);
          alert(`L'inscription a échoué : ${error.response.data.detail || 'Erreur inconnue'}`);
        } else if (error.request) {
          alert("Pas de réponse du serveur. Veuillez réessayer plus tard.");
        } else {
          alert("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
        }
      }
    }
  }
};
</script>

<style>
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

.form-group input[type="checkbox"] {
  width: auto;
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

.success-message {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid green;
  border-radius: 3px;
  background-color: #d4edda;
  color: #155724;
  text-align: center;
}
</style>
