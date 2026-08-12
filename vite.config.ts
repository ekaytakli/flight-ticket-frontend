// Vite yapılandırmasını oluşturmak için kullanılır.
import { defineConfig } from "vite";

// React projesinin Vite ile çalışmasını sağlar.
import react from "@vitejs/plugin-react";

export default defineConfig({
  // React desteğini aktif eder.
  plugins: [react()],

  server: {
    proxy: {
      /*
       * /api ile başlayan authentication ve seat
       * isteklerini Spring Boot backend'e yönlendirir.
       */
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },

      /*
       * FlightController /rest ile başladığı için
       * uçuş isteklerini de backend'e yönlendirir.
       */
      "/rest": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },

    // npm run dev çalışınca uygulamayı tarayıcıda açar.
    open: true,
  },
});