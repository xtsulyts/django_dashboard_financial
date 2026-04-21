"use client";

import { useUser } from "../contex/UserContex";
import Image from "next/image";
import { User, Mail, ShieldCheck } from "lucide-react";

const Perfil = () => {
  const { user } = useUser();

  if (!user) return null;

  const campos = [
    { icon: User,        label: "Usuario",  value: user.user  },
    { icon: Mail,        label: "Email",    value: user.email },
    { icon: ShieldCheck, label: "Rol",      value: user.role  },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src={user.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user.user}`}
            alt="Avatar"
            width={88}
            height={88}
            className="w-22 h-22 rounded-full border-4 border-slate-100 dark:border-gray-700 shadow-md mb-4"
            unoptimized
          />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.user}</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{user.email}</span>
        </div>

        {/* Campos */}
        <div className="space-y-3">
          {campos.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl px-4 py-3"
            >
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm shrink-0">
                <Icon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Perfil;
