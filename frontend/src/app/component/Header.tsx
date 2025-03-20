
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";



export default function Header() {
  const router = useRouter();




  return (
    <>
      <header className="row-start-3 flex gap-6 flex-wrap items-center justify-center  bg-gray-800 text-white py-4">
        <button
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          onClick={() => router.push("/")}
        >
          Home
        </button>
        <button
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          onClick={() => router.push("/home")}
        >
          Usuario
        </button>
        <button
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          onClick={() => router.push("/transacciones")}
        >
          Transacciones
        </button>
        <button
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          onClick={() => router.push("/movimientos")}
        >
          Movimientos
        </button>
      </header>
    </>
  );
}




