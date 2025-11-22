/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")], 
  theme: {
    extend: {
      colors: {
        // Colores principales del diseño APARCS
        aparcs: {
          // Fondos
          bg: '#D4EDFC',           // Celeste claro - fondo principal
          'bg-light': '#E8F4FC',   // Celeste más claro
          'bg-dark': '#B8DDF5',    // Celeste más oscuro
          
          // Azules para botones y acentos
          primary: '#1E90FF',      // Azul principal - botones
          'primary-dark': '#0066CC', // Azul oscuro - hover/active
          'primary-light': '#4DA6FF', // Azul claro
          
          // Texto
          'text-dark': '#005A9C',  // Azul oscuro - títulos
          'text-medium': '#0077B6', // Azul medio
          
          // Navbar
          navbar: '#1E90FF',       // Azul navbar
          'navbar-active': '#FF6347', // Tomato - icono activo
          
          // Estados de asistencia
          presente: '#00C853',     // Verde - presente/justificado
          ausente: '#FF1744',      // Rojo - ausente/no justificado
          tarde: '#FF9100',        // Naranja - llegó tarde
          pendiente: '#FFD600',    // Amarillo - pendiente
          
          // Inputs y cards
          input: '#FFFFFF',        // Blanco - inputs
          card: '#FFFFFF',         // Blanco - cards
          border: '#B0BEC5',       // Gris - bordes
        }
      },
      borderRadius: {
        'aparcs': '20px',          // Border radius del diseño
      },
      boxShadow: {
        'aparcs': '0 4px 15px rgba(0, 0, 0, 0.1)',
        'aparcs-lg': '0 8px 25px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};
