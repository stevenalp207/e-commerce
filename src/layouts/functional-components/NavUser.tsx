import { getUserDetails } from "@/lib/shopify";
import type { user } from "@/lib/shopify/types";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Gravatar from "react-gravatar";
import { BsPerson } from "react-icons/bs";

export const fetchUser = async () => {
  try {
    const accessToken = Cookies.get("token");

    if (!accessToken) {
      return null;
    } else {
      const userDetails: user = await getUserDetails(accessToken);
      const userInfo = userDetails.customer;
      return userInfo;
    }
  } catch (error) {
    // console.log("Error fetching user details:", error);
    return null;
  }
};

const NavUser = ({ pathname }: { pathname: string }) => {
  const [user, setUser] = useState<any>();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userInfo = await fetchUser();
      setUser(userInfo);
    };
    getUser();
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative">
      {user ? (
        <button
          onClick={toggleDropdown}
          className="relative cursor-pointer text-left sm:text-xs flex items-center justify-center"
        >
          <div className="flex items-center gap-x-1">
            <div className="h-6 w-6 border border-darkmode-border dark:border-border rounded-full">
              <Gravatar email={user?.email} style={{ borderRadius: "50px" }} />
            </div>
            <div className="leading-none max-md:hidden">
              <div className="flex items-center">
                <svg
                  className={`w-5 text-dark dark:text-darkmode-dark dark:hover:text-darkmode-primary`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <a
          className="text-xl text-dark hover:text-primary dark:border-darkmode-border dark:text-white flex items-center"
          href="/iniciar-sesion"
          aria-label="Iniciar sesión"
        >
          <BsPerson className="dark:hover:text-darkmode-primary" />
        </a>
      )}

      {dropdownOpen && (
        <div className="z-20 text-center absolute w-36 bg-white dark:bg-[#252525] shadow-md rounded mt-2 right-0">
          <button
            onClick={handleLogout}
            className="btn btn-primary max-md:btn-sm mt-2"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default NavUser;
