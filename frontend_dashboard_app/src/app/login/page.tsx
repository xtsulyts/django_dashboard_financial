import Image from "next/image";

export default function Login(){
    return (
        <>
         <main className="flex flex-col gap-8 row-start-2 items-center  sm:items-start">
        <Image
          className="dark:invert"
          src="/pie-chart.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Gestion de gatos{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              python/django
            </code>
          </li>
          <li>Organiza tus gastos, ten un contrl de una forma grafi.</li>
        </ol>

        <div className="flex gap-3 items-center justify-center flex-col sm:flex-row h-screen w-full">


          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="./"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              
              src="/log-in.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            login
          </a>
          
        </div>
      </main>
        </>
    )
}