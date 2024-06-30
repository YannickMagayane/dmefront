
<template>
    <nav class="bg-white shadow-md mt-1">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <button @click="toggleMobileMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="sr-only">Open main menu</span>
              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0">
              <img class="h-8 w-auto" src="https://img.icons8.com/?size=100&id=61288&format=png&color=000000" alt="Workflow">
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                <router-link to="/" class="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</router-link>
                <router-link to="/patients" class="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Liste des Patients</router-link>
                <router-link to="/gestion-ssi" class="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Gestion SSI</router-link>

                <!-- Ajoutez d'autres liens ici -->
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="sm:hidden" v-if="mobileMenuOpen">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" class="text-gray-700 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</router-link>
          <router-link to="/patients" class="text-gray-700 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Liste des Patients</router-link>
          <router-link to="/gestion-ssi" class="text-gray-700 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Gestion SSI</router-link>

          
          <!-- Ajoutez d'autres liens ici -->
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        mobileMenuOpen: false
      };
    },
    methods: {
      toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez des styles personnalisés ici si nécessaire */
  </style>
  