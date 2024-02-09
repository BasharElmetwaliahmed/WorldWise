import { useEffect } from "react";
import { useState } from "react";
import useUrlPosition from "../hooks/useUrlPosition";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../Context/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [emoji, setEmoji] = useState();
  const [geocodaingError, setGeocodaingError] = useState("");
  const { createCity, isLoading } = useCities();

  useEffect(() => {
    if (!lat || !lng) return;
    async function fetchCityData() {
      setGeocodingLoading(true);
      setGeocodaingError("");
      try {
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        console.log(data);
        if (data.countryName.length == 0)
          throw new Error("no city there click on another place on map");
        setCityName(data.city || data.locality);
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryName));
      } catch (err) {
        console.log(err.message);
        setGeocodaingError(err.message);
      } finally {
        console.log("fi");
        setGeocodingLoading(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      date,
      position: {
        lat,
        lng,
      },
      notes,
      emoji,
    };
    await createCity(newCity);
    navigate("/app/cities");
  };
  if (geocodingLoading) return <Spinner />;
  if (!lat || !lng) return <Message message="Click On Map First !" />;
  if (geocodaingError) return <Message message={geocodaingError} />;
  return (
    <form className={`${styles.form} ${isLoading ? `${styles.loading}` : ""}`}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={handleSubmit}>
          Add
        </Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
