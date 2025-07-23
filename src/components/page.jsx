import { ListRestart, Search } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: 1rem; /* general padding for small screens */

  .body {
    width: 100%;
    max-width: 400px;
    padding: 2rem 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    min-height: 80vh;
  }

  .search-location {
    display: flex;
    gap: 10px;
    width: 100%;
    margin-bottom: 1rem;
    box-sizing: border-box;
  }

  .search-location input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    box-sizing: border-box;
  }

  .search-btn {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .display-details {
    text-align: center;
    margin-bottom: 1.5rem;
    border: 0.5px solid #ccc;
    border-radius: 10px;
    padding: 1rem;
    /* background-color: #f9f9f9; */
    transition: all 0.3s ease; /* Smooth animation */

    &:hover {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Shadow on hover */
      transform: scale(1.03); /* Slight zoom effect */
    }
  }

  .weather-pic svg {
    width: 40px;
    height: 40px;
    color: #333;
  }

  .weather-pic {
    background-color: #007bff;
    padding: 10px;
    border-radius: 12px;
    display: inline-block;
  }

  .temp {
    margin-top: 8px;
    font-size: 1.4rem;
  }

  .cloud-description {
    color: #555;
  }

  .reset-text {
    font-size: small;
  }

  .re {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .restart {
    width: auto;
    height: 30px;
    margin-bottom: 5px;
  }

  .re :hover {
    color: #ed2424;
  }

  /* Responsive styling for small screens */
  @media (max-width: 480px) {
    .body {
      padding: 1.5rem 1rem;
      min-height: auto;
    }

    .search-location {
      flex-direction: column;
    }

    .search-location input,
    .search-btn {
      width: 100%;
    }

    .restart {
      margin-bottom: 10px;
    }
  }
`;

const WeatherApp = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });

  const [locationWeather, setLocationWeather] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchedWeather, setSearchedWeather] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const reset = () => {
    setSearchedWeather(null);
  };

  const apiKey = "af5cc6e6a3804b4732d4af36a9f99782";

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null); // clear any previous error
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          setLocationError(
            "Please enable location services to see your local weather and refresh your browser."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const weather = data?.weather?.[0];
          if (weather && data?.main && data?.name) {
            setLocationWeather({
              name: data.name,
              temp: data.main.temp,
              description: weather.description,
              icon: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching location weather:", err.message);
        });
    }
  }, [location]);

  const handleSearch = () => {
    if (!searchInput.trim()) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("City not found");
        return res.json();
      })
      .then((data) => {
        const weather = data?.weather?.[0];
        if (weather && data?.main && data?.name) {
          setSearchedWeather({
            name: data.name,
            temp: data.main.temp,
            description: weather.description,
            icon: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
          });
          setSearchInput("");
        }
      })
      .catch((err) => {
        alert(err.message);
        setSearchedWeather(null);
      });
  };

  return (
    <Wrapper>
      <div className="body">
        <div className="search-location">
          <input
            type="text"
            placeholder="Search Location"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            <Search size={20} />
          </button>
        </div>

        {locationError && (
          <div
            style={{
              color: "#cc0000",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {locationError}
          </div>
        )}

        {locationWeather && (
          <div className="display-details">
            <h2 className="city">{locationWeather.name}</h2>
            <div className="weather-pic">
              <img src={locationWeather.icon} alt="weather icon" />
            </div>
            <p className="cloud-description">{locationWeather.description}</p>
            <h2 className="temp">Temperature: {locationWeather.temp}°C</h2>
          </div>
        )}

        {searchedWeather && (
          <div className="display-details">
            <h2 className="city">{searchedWeather.name}</h2>
            <div className="weather-pic">
              <img src={searchedWeather.icon} alt="weather icon" />
            </div>
            <p className="cloud-description">{searchedWeather.description}</p>
            <h2 className="temp">Temperature: {searchedWeather.temp}°C</h2>
          </div>
        )}

        <div className="re">
          <button onClick={reset} className="restart">
            {" "}
            <ListRestart />
            <p className="reset-text">Reset</p>
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default WeatherApp;
