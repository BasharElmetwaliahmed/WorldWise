import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CitiesProvider } from "./Context/CitiesContext";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import CityList from "./Components/CityList";
import CountryList from "./Components/CountryList";
import City from "./Components/City";
import Form from "./Components/Form";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoutes from "./pages/ProtectedRoutes";


function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <CitiesProvider>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/app"
              element={
                <ProtectedRoutes>
                  <AppLayout />
                </ProtectedRoutes>
              }>
              <Route index element={<Navigate to="cities" replace />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CitiesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
