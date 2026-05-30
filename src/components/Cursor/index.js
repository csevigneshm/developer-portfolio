import React, { useEffect, useState } from "react";
import "./Cursor.css";

const MOBILE_QUERY = "(max-width: 992px)";

const isMobileView = () => window.matchMedia(MOBILE_QUERY).matches;

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(() => !isMobileView());
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleViewportChange = () => setEnabled(!mediaQuery.matches);

    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const cursorInner = document.getElementById("cursor-inner");
    const cursorOuter = document.getElementById("cursor-outer");
    const links = document.querySelectorAll("a, label, button");

    if (!cursorInner || !cursorOuter) {
      return undefined;
    }

    const handleMouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorInner.style.left = `${posX}px`;
      cursorInner.style.top = `${posY}px`;

      cursorOuter.animate(
        {
          left: `${posX}px`,
          top: `${posY}px`,
        },
        { duration: 500, fill: "forwards" }
      );
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener("mousemove", handleMouseMove);

    links.forEach((link) => {
      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div
        id="cursor-inner"
        className={`cursor-inner ${isHovering ? "hover" : ""}`}
      ></div>
      <div
        id="cursor-outer"
        className={`cursor-outer ${isHovering ? "hover" : ""}`}
      ></div>
    </>
  );
};

export default CustomCursor;
