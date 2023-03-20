import { useEffect } from "react";

const Scroller = ({ location }) => {
  // const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default Scroller;
