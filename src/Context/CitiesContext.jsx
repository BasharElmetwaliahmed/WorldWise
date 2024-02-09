import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:9070";
function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setLoading] = useState();
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:9070/cities`);

        const data = await res.json();

        setCities(data);
      } catch {
        alert("error while loading cities please try again");
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:9070/cities/${id}`);

      const data = await res.json();

      setCurrentCity(data);
    } catch {
      alert("error while loading cities please try again");
    } finally {
      setLoading(false);
    }
  }
  async function createCity(newCity) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:9070/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      setCities((cities) => [...cities, data]);
    } catch {
      alert("error while creating city please try again");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCity(id) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:9070/cities/${id}`, {
        method: "DELETE",
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("error while deleting city please try again");
    } finally {
      setLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, getCity, currentCity, createCity,deleteCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };
