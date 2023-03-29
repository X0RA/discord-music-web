import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pages } from "../App";

export default function Header() {
  const toggleDarkMode = () => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <header className="header py-2 px-4 rounded-full mx-auto w-max mt-5 sm:pr-5 sm:pl-5">
      <nav>
        <ul className="flex items-center space-x-4">
          {pages.map((page, i) => {
            return (
              <li key={i}>
                <Link
                  className="header-link"
                  aria-current="page"
                  to={page.path}
                >
                  {page.name}
                </Link>
              </li>
            );
          })}

          <li>
            <svg
              onClick={toggleDarkMode}
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current header-link"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />{" "}
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="5" x2="12" y2="3" />{" "}
              <line x1="17" y1="7" x2="18.4" y2="5.6" />
              <line x1="19" y1="12" x2="21" y2="12" />{" "}
              <line x1="17" y1="17" x2="18.4" y2="18.4" />
              <line x1="12" y1="19" x2="12" y2="21" />{" "}
              <line x1="7" y1="17" x2="5.6" y2="18.4" />
              <line x1="6" y1="12" x2="4" y2="12" />{" "}
              <line x1="7" y1="7" x2="5.6" y2="5.6" />
            </svg>
          </li>
        </ul>
      </nav>
    </header>
  );
}
