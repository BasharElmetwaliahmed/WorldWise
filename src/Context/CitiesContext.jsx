import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:9070";

const initialState = {
  currentCity: {},
  cities: [],
  isLoading: false,
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading": {
      return { ...state, isLoading: true, error: "" };
    }
    case "cities/loaded": {
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
        error: "",
        isLoading: false,
      };
    }
    case "cities/created": {
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    }
    case "cities/deleted": {
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    }
    case "city/loaded": {
      return { ...state, currentCity: action.payload, isLoading: false };
    }
    default: {
      throw new Error("unkown action");
    }
  }
}
function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setLoading] = useState();
  // const [currentCity, setCurrentCity] = useState({});
  const [{ currentCity, cities, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`http://localhost:9070/cities`);

        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        alert("error while loading cities please try again");
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    if (id === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:9070/cities/${id}`);

      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch {
      alert("error while loading cities please try again");
    }
  }
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:9070/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      dispatch({ type: "cities/created", payload: data });
    } catch {
      alert("error while creating city please try again");
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`http://localhost:9070/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cities/deleted", payload: id });
    } catch {
      alert("error while deleting city please try again");
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };
