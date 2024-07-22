<template>
  <nav class="bg-white shadow-md mt-1" v-if="isLoggedIn">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <!-- ... Mobile menu button (omitted for brevity) ... -->

        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex-shrink-0">
            <!-- Logo or branding image -->
            <img class="h-8 w-auto" src="https://img.icons8.com/?size=100&id=61288&format=png&color=000000" alt="Logo">
          </div>
          <div class="hidden sm:block sm:ml-6">
            <!-- Menu links -->
            <div class="flex space-x-4">
             <!-- <router-link to="/" class="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</router-link>-->
              <router-link v-if="affectation === 'reception'" to="/patients" class="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Liste des Patients</router-link>
              <router-link v-if="affectation === 'ssi'" to="/gestion-ssi" class="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Gestion SSI</router-link>
              <router-link v-if="affectation === 'consultation'" to="/patients-sans-consultation" class="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Patients Sans Consultation</router-link>
              <router-link v-if="affectation === 'consultation'"  to="/consultation-manager" class="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Consultation Manager</router-link>
              <!-- Add more links here as needed -->
            </div>
          </div>
        </div>

        <!-- Logout button -->
        <div class="absolute inset-y-0 right-0 flex items-center">
          <button @click="logout" class="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium">
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <!-- Mobile menu code omitted for brevity -->
  </nav>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoggedIn: false,
      affectation: localStorage.getItem('affectation') || '', // Get affectation from localStorage
    };
  },
  created() {
    // Check login status when component is created
    this.checkLoginStatus().then(() => {
      this.startAutoCheckLoginStatus(); // Start auto-checking login status
    });
  },
  methods: {
    async checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;

      if (this.isLoggedIn) {
        try {
          // Fetch user affectation data
          const response = await axios.get('http://127.0.0.1:8000/patient/affectations/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const userId = JSON.parse(atob(token.split('.')[1])).user_id; // Decode JWT token to get user ID
          const userAffectation = response.data.find(affectation => affectation.email === userId);

          if (userAffectation && userAffectation.is_approuve) {
            this.affectation = userAffectation.affectation;
            localStorage.setItem('affectation', this.affectation); // Save affectation in localStorage
          } else {
            this.logout();
          }
        } catch (error) {
          console.error('Failed to fetch user affectation:', error);
          this.logout();
        }
      }
    },
    logout() {
      localStorage.removeItem('token'); // Remove token from localStorage
      localStorage.removeItem('affectation'); // Remove affectation from localStorage
      axios.defaults.headers.common['Authorization'] = ''; // Clear Authorization header
      this.isLoggedIn = false;
      this.$router.push('/'); // Redirect to home page
    },
    startAutoCheckLoginStatus() {
      setInterval(this.checkLoginStatus, 1000); // Auto-check login status every 30 seconds
    }
  }
};
</script>

<style scoped>
/* Add scoped styles here if necessary */
</style>
