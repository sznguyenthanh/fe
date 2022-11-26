import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { io } from "socket.io-client";

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Nhiệt độ",
    },
  },
};

export default function Data() {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const ref = useRef();
  const [weather, setWeather] = useState({ labels });
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      // weather
      const { data: data1 } = await axios.get("http://localhost:5000/get-data");
      setWeather({
        ...weather,
        datasets: [
          {
            label: "Cảm biến 1",
            data: data1,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });

      // user
      const { data: data2 } = await axios.get(
        `http://localhost:5000/check-user/user1`
      );
      setUser(data2[0]);
    };
    fetchData();

    const connectSocket = () => {
      const socket = io("ws://localhost:5000");

      socket.on("connect", (...args) => {
        console.log("connect ws success");
      });

      socket.on("new-weather", function (data) {
        fetchData();
      });
    };
    connectSocket();

    setInterval(() => {
      fetchData();
    }, 10000);
  }, []);

  const updateData = async () => {
    const { data } = await axios.get("http://localhost:5000/get-data");

    setWeather({
      ...weather,
      datasets: [
        {
          label: "Cảm biến 1",
          data: data,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    });
  };

  console.log(user);

  const updateState = async () => {
    const { data } = await axios.get("http://localhost:5000/change-state");

    if (data.success) {
      Swal.fire({
        title: "Update success",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Server error, please try again!",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      {user && user.isAdmin ? (
        <div className="chart">
          {weather.datasets && weather.datasets.length > 0 && (
            <Line options={options} data={weather} ref={ref} />
          )}
          <div className="button-data">
            <Link to="/">
              <button>Back home</button>
            </Link>
            <button
              onClick={() => {
                updateData();
              }}
            >
              Update data
            </button>
            <button onClick={() => updateState()}>On</button>
          </div>
        </div>
      ) : (
        <div>Ban khong phai admin</div>
      )}
    </>
  );
}
