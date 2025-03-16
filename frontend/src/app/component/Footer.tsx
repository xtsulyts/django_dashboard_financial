import Image from "next/image";
 
 export default function Footer () {
    return (
        <>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center  bg-gray-800 text-white py-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
         className="dark:invert"
         aria-hidden
         src="/github.svg"
         alt="Globe icon"
         width={30}
         height={30}
         
          />
          Github
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://https://github.com/xtsulyts"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
           className="dark:invert"
           aria-hidden
           src="/linkedin.svg"
           alt="Globe icon"
           width={30}
           height={30}
          />
          Linkedin
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/walter-manuel-frias-61b03244/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            aria-hidden
            src="/at-sign.svg"
            alt="Github"
            width={30}
            height={30}
          />
          Contact
        </a>
      </footer>
        </>
    );
 }
 
 
 
 
 