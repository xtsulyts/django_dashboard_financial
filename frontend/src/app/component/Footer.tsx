import Image from "next/image";
 
 export default function Footer () {
    return (
        <>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
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
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
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
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
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
 
 
 
 
 