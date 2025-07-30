

const Footer = () => {

    const Link = ({aria, link, name}) => {
        return ( 
            <li><a aria-label={aria}  href={link} className=" text-white text-2xl hover:text-amber-400">{name}</a></li>
        )
    }

    const links1 = [
        { "alt": "Back to top of homepage", "link": "/", "name": "Home" },
        { "alt": "See My Work", "link": "/work", "name": "Work" },
        { "alt": "Learn More About Me", "link": "/about-maaz", "name": "About Me" },
        { "alt": "View My Skills", "link": "/skills", "name": "Skills" },
        { "alt": "Contact Me", "link": "/contact", "name": "Contact Me" },
        { "alt": "Viw Blogs Written By Mohammed Maaz Rayeen", "link": "/maaz-blogs", "name": "Blogs" },
  ]

  const links2 = [
        { "alt": "Book A Call", "link": "/booking", "name": "Book A Call" },
        { "alt": "Explore Services offered in Texas", "link": "/web-design-texas", "name": "Services In Texas" },
        { "alt": "Explore Services offered in California", "link": "/web-design-california", "name": "Services In California" },
        { "alt": "Explore Services offered in Florida", "link": "/web-design-florida", "name": "Services In Florida" },
        { "alt": "See the Pricing for web design and development services", "link": "/pricing", "name": "Pricing" },
        { "alt": "Make A Payment", "link": "/payment", "name": "Make A Payment" }
  ]


  return (
      <footer id = "#footerdown" className="flex items-center justify-center ">     {/*from-purple-900 via-gray-950   to-purple-900       from-gray-950   via-purple-950   to-gray-950 */}
        <div className="  w-full max-w-[1800px]   playfair-font    ">
          <div className=" py-4  ">
            <div className="container px-4 mx-auto">
                <div className="-mx-4 flex flex-wrap justify-between">
                    {/*Photo and Description*/}
                    <div className="px-4 my-4 w-full xl:w-1/5        playfair-font    mb-16 sm:mb-12">


                        <a aria-label="Back to top of homepage" href="/" className=" w-56 mb-5 flex flex-row gap-[20px]">
                            <img className="rounded-full h-16 w-16    sm:w-20 sm:h-20     xl:w-16 xl:h-16" src = "/images/favb.png"  alt = "Maaz, the owner of this portfolio"/>
                                  
                            <h2 className="playfair-font  mt-2.5  inline-block text-4xl  sm:mb-4   sm:mt-5    xl:text-2xl  text-white font-semibold">Maaz</h2>         
                        </a>

                      <div  className="text-2xl        xl:text-xl">

                        <p className="     mb-8     sm:mb-10">
                            I transform ideas into seamless digital experiences that shape the face of your brand — where innovation meets identity.
                        </p>

                        <p className="     mb-2      ">
                            Email :
                        </p>

                        <p className="  sm:mb-10">
                            admin@maazverse.com                      
                        </p>
                      </div>
                    </div>



                      <div className="px-4 my-4 w-full sm:w-auto hidden sm:block">
                        <div>
                          <h2 className="inline-block text-4xl  mb-4 text-white font-semibold">Explore</h2>
                        </div>
                        <ul className="leading-10    md:leading-12   text-lg sm:text-xl ">
                            {links1.map((link, index) => (
                                <Link aria={link.alt} link={link.link} name={link.name} key={index}/>
                            ))}
                        </ul>
                      </div>
                      <div className="px-4 my-4 w-full sm:w-auto hidden sm:block">
                        <div>
                          <h2 className="inline-block text-4xl  mb-4 text-white font-semibold">Get Started</h2>
                        </div>

                          <ul className="leading-10   md:leading-12 text-lg sm:text-xl ">
                              {links2.map((link, index) => (
                                  <Link aria={link.alt} link={link.link} name={link.name} key={index}/>
                              ))}
                          </ul>
                      </div>


                      <div className="sm:hidden   w-full     ">
                          <div className="px-4 my-4  sm:w-auto    ">
                            <div>
                              <h2 className="inline-block text-4xl mb-6 text-white font-semibold">Explore</h2>  {/*border-b-4 border-[#e3158a]*/}
                            </div>
                            <ul className="leading-12  text-2xl   gap-8">
                                {links1.map((link, index) => (
                                    <Link aria={link.alt} link={link.link} name={link.name} key={index}/>
                                ))}
                            </ul>
                        </div>

    

                            <div className="px-4 my-4  mt-16   sm:w-auto">
                              <div>
                                  <h2 className="inline-block text-4xl mb-6 text-white font-semibold">Get Started</h2>
                              </div>
                              <ul className="leading-12     text-2xl ">
                                  {links2.map((link, index) => (
                                      <Link aria={link.alt} link={link.link} name={link.name} key={index}/>
                                  ))}
                              </ul>

                            </div>
                          </div>
            
                 
                          <div className="px-4 my-4 w-full sm:w-auto xl:w-1/4     relative  mt-[50px]     md:mt-[-0px]">
                              <div className="px-4 my-4 w-full sm:w-auto    ">
                                <div>
                                  <h2 className="inline-block text-4xl     mb-8   md:mb-4  xl:text-3xl 2xl:text-4xl   text-white font-semibold">Connect With Me</h2>
                                </div>


                              </div>
                            </div>
                </div>
              </div>
          </div>
          <div className=" py-4 flex justify-center items-center ">
            <div className="container mx-auto px-4">
              <div className="-mx-4 flex justify-center items-center flex-col">
                <div className = "w-[50%] border-t-1 border-[#f2efef] "></div>
                <div className="mt-4 px-4 w-full text-center sm:w-auto sm:text-left text-white font-semibold">
                    Copyright © 2025 Mohammed Maaz Rayeen. All Rights Reserved.
                </div>

              </div>
            </div>
          </div>
         </div>
        </footer>

  );
};

export default Footer;
