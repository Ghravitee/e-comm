import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  // useLocation hook gives us the current pathname, and we set up an effect
  // that runs whenever the pathname changes. Inside the effect,
  // we call window.scrollTo(0, 0) to scroll the page back to the top-left corner whenever the route changes.
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
