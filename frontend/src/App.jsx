import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppRoutes />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
