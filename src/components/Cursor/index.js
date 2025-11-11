import React, { useEffect, useState } from "react";
import "./Cursor.css"; // We will create this CSS file for styling

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursorInner = document.getElementById("cursor-inner");
    const cursorOuter = document.getElementById("cursor-outer");
    const links = document.querySelectorAll("a, label, button");

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

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);

    links.forEach((link) => {
      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup event listeners when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

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
