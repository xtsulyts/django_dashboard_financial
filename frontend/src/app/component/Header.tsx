export default function Header () {
    return (
        <>
        <header className="row-start-3 flex gap-6 flex-wrap items-center justify-center  bg-gray-800 text-white py-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="http://localhost:3000/"
          target="_blank"
          rel="noopener noreferrer"
        >

          Home
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="http://localhost:3000/transacciones"
          target="_blank"
          rel="noopener noreferrer"
        >

          Transacciones
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          href="http://localhost:3000/home"
          rel="noopener noreferrer"
        >
   
          Usuario
        </a>
        
      </header>
        </>
    );
 }
 
 
 
 
 