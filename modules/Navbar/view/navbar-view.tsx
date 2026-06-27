"use client";

import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import NavLinks from "../components/NavLinks";
import LanguageSwitcher from "../components/LanguageSwitcher";
import LoginButton from "../components/LoginButton";
import CTAButton from "../components/CTAButton";
import AnnouncementBar from "../components/AnnouncementBar";

const NavbarView = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle Scroll Behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Trigger glass blur styles after scrolling past 10px
      setIsScrolled(currentScrollY > 10);

      // Hockerty style: Hide entire header when scrolling down, show on up-scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isNavVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Announcement Bar Container with smooth height slide transitions */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          !isScrolled
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <AnnouncementBar />
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`h-18 text-lg px-6 flex justify-between items-center transition-all duration-300 bg-whie ${
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : ""
        }`}
      >
        <Logo />
        <NavLinks />
        <LanguageSwitcher />
        <LoginButton />
        <CTAButton />
      </nav>

      {/* Slide-down Mobile Menu */}
      <div
        className={`md:hidden bg-white border-b shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100 py-4 px-6"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-4">
          <NavLinks />
          <hr className="border-gray-200" />
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <LanguageSwitcher />
            <LoginButton />
          </div>
          <div className="pt-2">
            <CTAButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarView;
