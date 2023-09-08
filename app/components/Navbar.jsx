import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../assets/speedsurvey-low-resolution-logo-color-on-transparent-background.png";
import ThemeChanger from "./useTheme";
import NavigationOptions from "./NavigationOptions";

const Navbar = () => {
  return (
    <nav className="flex justify-between">
      <div>
        <Link href={"/"}>
          <Image src={logo} alt="Survey website logo(books)" width={150} />
        </Link>
      </div>
      <div className="mt-5 mr-2">
        <ThemeChanger />
        <NavigationOptions />
      </div>
    </nav>
  );
};

export default Navbar;
