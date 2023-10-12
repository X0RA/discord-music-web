import {Routes, Route } from 'react-router-dom';
import TopArtists from "./pages/topArtists";
import TopSongs from "./pages/topSongs";
import { useEffect } from "react";
import Users from "./pages/users";

const pages = [
  { name: "Top Artists", path: "/" },
  { name: "Top Songs", path: "/songs" },
  { name: "Users", path: "/users" },
];

function App() {
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
    if (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<TopArtists />} />
      <Route exact path="/songs" element={<TopSongs />} />
      <Route exact path="/users" element={<Users />} />
    </Routes>
  );
}

export default App;

export {pages}
