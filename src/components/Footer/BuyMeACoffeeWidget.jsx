import { useEffect } from "react";

const BuyMeACoffeeWidget = ({ 
  id = "vignez", 
  description = "Support me on Buy me a coffee!", 
  message = "", 
  color = "#BD5FFF", 
  position = "left", 
  xMargin = 18, 
  yMargin = 18 
}) => {
  
  useEffect(() => {
    // Check if the script is already present
    const existingScript = document.querySelector(
      'script[src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
      script.async = true;
      script.setAttribute("data-name", "BMC-Widget");
      script.setAttribute("data-cfasync", "false");
      script.setAttribute("data-id", id);
      script.setAttribute("data-description", description);
      script.setAttribute("data-message", message);
      script.setAttribute("data-color", color);
      script.setAttribute("data-position", position);
      script.setAttribute("data-x_margin", xMargin);
      script.setAttribute("data-y_margin", yMargin);

      document.body.appendChild(script);

      // Cleanup function
      return () => {
        document.body.removeChild(script);
        const widget = document.querySelector('[data-name="BMC-Widget"]');
        if (widget) widget.remove();
      };
    }
  }, [id, description, message, color, position, xMargin, yMargin]);

  return null; // No JSX needed
};

export default BuyMeACoffeeWidget;
