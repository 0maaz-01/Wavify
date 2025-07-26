import { useState, useEffect } from "react";
import clsx from "clsx";
import { navLinks } from "../constants";



const NavBar = ({page, color}) => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
  
    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
        <header className={`navbar      lg:bg-transparent      ${scrolled ? "scrolled bg-transparent  lg:bg-transparent      " : `not-scrolled `}              max-w-[1800px]     text-base  sm:text-lg md:text-xl    lg:text-base  2xl:text-xl `}>
            <div className="inner mb-[2vh]   playfair-font">

                <nav className={clsx("  border-1 border-white/50   mt-10  hover:bg-black/60  bg-gradient-to-br  bg-black     p-6  pt-2 pb-2 absolute right-5  rounded-xl  ",
                      color === "white"   && ""   
                )}>
                    <ul>
                        {navLinks.map(({ link, name, alt }, index) => (
                          <li key={name} className = "group font-semibold       text-white  ">
                              <a aria-label = {alt} href={link}   className={`    ${page === `${name}` ? "bg-white/20" : ""}          `}>
                                  <span>{name}</span>
                                  
                              </a>
                          </li>
                      ))}
                    </ul>
                </nav>


                
            </div>


        </header>
  );
}

export default NavBar;
