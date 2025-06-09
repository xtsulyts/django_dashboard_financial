import React from 'react'
import { useUser } from "../contex/UserContex"

const Avatar = () => {
  const { user } = useUser()
  console.log(user)
  return (
    <div className='flex'>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
        { }
        <img
          src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user}`}
          alt="Avatar"
          className="w-15 h-15 rounded-full border-4 border-blue-100 shadow-sm"
        />
        <span className="text-gray-900 dark:text-yellow-400 group-hover:underline">
          {user?.user || "Invitado"}
        </span>
      </h1>

    </div>
  )
}

export default Avatar
