import React from 'react'
import { useUser } from "../contex/UserContex"
import Image from 'next/image' // ← AÑADE ESTE IMPORT

const Avatar = () => {
  const { user } = useUser()
  console.log(user)
  return (
    <div className='flex'>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
        { }
        {/* REEMPLAZA <img> por <Image /> */}
        <Image
          src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user || 'default'}`}
          alt="Avatar"
          width={60}  // w-15 = 15 * 4 = 60px (si es w-15, ajusta si es w-10, w-12, etc.)
          height={60} // h-15 = 15 * 4 = 60px
          className="w-15 h-15 rounded-full border-4 border-blue-100 shadow-sm"
          unoptimized={true} // ← IMPORTANTE para SVGs de Dicebear
        />
        <span className="text-gray-900 dark:text-yellow-400 group-hover:underline ml-3"> {/* ← Añadí ml-3 para separación */}
          {user?.user || "Invitado"}
        </span>
      </h1>
    </div>
  )
}

export default Avatar