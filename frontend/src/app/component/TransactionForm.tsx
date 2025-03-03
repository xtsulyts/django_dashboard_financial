"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../contex/UserContex'; // Asegúrate de importar el hook useUser

type Transaction = {
  id?: number;
  monto: number;
  fecha: string;
  descripcion?: string;
  tipo: 'INGRESO' | 'GASTO';
  categoria?: number; // ID de la categoría
  usuario?: number; // Cambiado a número para el ID del usuario
};

type TransactionFormProps = {
  transaction?: Transaction; // Datos de la transacción si se está editando
  onSubmit: (transaction: Transaction) => void; // Función para manejar el envío del formulario
  onDelete?: (id: number) => void; // Función para manejar la eliminación (opcional)
};

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSubmit, onDelete }) => {
  const { user } = useUser(); // Obtén el usuario autenticado desde el contexto
  const [formData, setFormData] = useState<Transaction>({
    monto: transaction?.monto || 0,
    fecha: transaction?.fecha || new Date().toISOString().split('T')[0], // Fecha actual por defecto
    descripcion: transaction?.descripcion || '',
    tipo: transaction?.tipo || 'GASTO',
    categoria: transaction?.categoria || undefined,
    usuario: user?.id, // Usamos el ID del usuario
    
  });
  console.log("usuario desde form",user?.id)

  // Efecto para actualizar el estado si cambia la transacción (edición)
  useEffect(() => {
    if (transaction) {
      setFormData({
        monto: transaction.monto,
        fecha: transaction.fecha,
        descripcion: transaction.descripcion,
        tipo: transaction.tipo,
        categoria: transaction.categoria,
        usuario: user?.id, // Asegúrate de incluir el ID del usuario al editar
      });
    }
  }, [transaction, user]); // Dependencia añadida: user
  console.log(user)

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica que el usuario esté autenticado
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    // Agrega el ID del usuario a los datos de la transacción
    const transactionWithUser = {
      ...formData,
      usuario: user.id, // Asegúrate de incluir el ID del usuario
    };

    console.log('Datos enviados al backend:', transactionWithUser); // Depuración

    onSubmit(transactionWithUser); // Enviar los datos al componente padre
  };

  // Manejar la eliminación de la transacción
  const handleDelete = () => {
    if (transaction?.id && onDelete) {
      onDelete(transaction.id); // Llamar a la función onDelete si existe
    }
  };

  return (
    

  <div className="flex flex-col items-center p-8 min-h-screen bg-gray-100">
           {/* Logo */}
           <div className="mb-8">
        <video
          src="/Main Scene.webm"
          autoPlay
          loop
          muted
          className="w-130 h-100 mx-auto"
        />
      </div>
    <form
    onSubmit={handleSubmit}
    className="flex flex-col items-center w-full max-w-sm bg-white p-8 rounded-lg shadow-md gap-6"
  >
 
    {/* Campos del formulario */}
    {[
      { label: "Monto", value: formData.monto, name: "monto", type: "number" },
      { label: "Fecha", value: formData.fecha, name: "fecha", type: "date" },
      { label: "Descripción (opcional)", value: formData.descripcion, name: "descripcion", type: "textarea" },
    ].map(({ label, value, name, type }) => (
      <div className="w-full" key={name}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            className="border p-3 w-full rounded-md border-gray-300 shadow-sm"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className="border p-3 w-full rounded-md border-gray-300 shadow-sm"
            required={type !== "textarea"}
          />
        )}
      </div>
    ))}
  
    {/* Tipo (Ingreso/Gasto) */}
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700">Tipo</label>
      <select
        name="tipo"
        value={formData.tipo}
        onChange={handleChange}
        className="border p-3 w-full rounded-md border-gray-300 shadow-sm"
        required
      >
        <option value="INGRESO">Ingreso</option>
        <option value="GASTO">Gasto</option>
      </select>
    </div>
  
    {/* Categoría */}
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700">Categoría (opcional)</label>
      <select
        name="categoria"
        value={formData.categoria || ""}
        onChange={handleChange}
        className="border p-3 w-full rounded-md border-gray-300 shadow-sm"
      >
        <option value="">Comida</option>
        <option value="">Salud</option>
        {/* Aquí puedes mapear categorías dinámicas */}
      </select>
    </div>
  
    {/* Botones */}
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-700 transition duration-300"
    >
      {transaction ? "Guardar Cambios" : "Crear Transacción"}
    </button>
  
    {transaction && onDelete && (
      <button
        type="button"
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-red-600 transition duration-300 mt-4"
      >
        Eliminar
      </button>
    )}
  </form>
  </div>
  );
};

export default TransactionForm;