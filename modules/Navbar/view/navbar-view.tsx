"use client";
import Logo from "../components/Logo";
import NavLinks from "../components/NavLinks";
import LanguageSwitcher from "../components/LanguageSwitcher";
import LoginButton from "../components/LoginButton";
import CTAButton from "../components/CTAButton";
import { useEffect, useState } from "react";

const NavbarView = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // triggers after 10px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`
      flex justify-between h-18 sticky top-0 z-50 border-b text-lg items-center px-6
      transition-all duration-300
      ${scrolled ? "bg-white/50 backdrop-blur-sm shadow-sm" : "bg-white"}
    `}
    >
      <Logo />
      <NavLinks />
      <LanguageSwitcher />
      <LoginButton />
      <CTAButton />
    </nav>
  );
};

export default NavbarView;
