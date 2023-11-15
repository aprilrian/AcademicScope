import DashboardMahasiswa from "../components/mahasiswa/DashboardMahasiswa";
import DashboardAdmin from "../components/admin/DashboardAdmin";
import DashboardDosen from "../components/dosen/DashboardDosen";
import DashboardDepartemen from "../components/departemen/DashboardDepartemen";
import Navbar from "../components/Navbar";

import { useRouter } from "next/router";

import { getCookie } from "cookies-next";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const route = useRouter();
  const token = getCookie("accessToken");

  const jwt = require("jsonwebtoken");

  let decoded = "";

  if (token) {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  }

  // Split the route.pathname
  const routeSplit = route.pathname.split("/");

  return (
    <>
      {Component.name !== "Login" && Component.name !== "Error" && <Navbar />}

      {routeSplit[1] === "mahasiswa" && !routeSplit[2] ? (
        <Component {...pageProps} />
      ) : routeSplit[1] === "mahasiswa" && routeSplit[2] ? (
        <DashboardMahasiswa token={decoded}>
          <Component {...pageProps} />
        </DashboardMahasiswa>
      ) : route.pathname.includes("/admin") ? (
        <DashboardAdmin token={decoded}>
          <Component {...pageProps} />
        </DashboardAdmin>
      ) : route.pathname.includes("/dosen") ? (
        <DashboardDosen token={decoded}>
          <Component {...pageProps} />
        </DashboardDosen>
      ) : route.pathname.includes("/departemen") ? (
        <DashboardDepartemen token={decoded}>
          <Component {...pageProps} />
        </DashboardDepartemen>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
