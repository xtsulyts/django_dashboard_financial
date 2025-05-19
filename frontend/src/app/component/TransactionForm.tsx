

"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../contex/UserContex'; // Importar el hook useUser
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../services/transactionService'; // Importar las funciones de la API
import { useRouter } from 'next/navigation';

type Transaction = {
  id?: number;
  monto: number;
  fecha: string;
  descripcion?: string;
  tipo: 'INGRESO' | 'GASTO';
  categoria?: number; // ID de la categoría
  usuario?: number; // ID del usuario
};

type Categoria = {
  id: number;
  nombre: string;
  descripcion?: string;
};

type TransactionFormProps = {
  transaction?: Transaction; // Datos de la transacción si se está editando
  onSubmitSuccess?: () => void; // Función para manejar el éxito del envío (opcional)
  onDeleteSuccess?: () => void; // Función para manejar el éxito de la eliminación (opcional)
};

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSubmitSuccess, onDeleteSuccess }) => {
  const { user, access_token } = useUser(); // Obtener el usuario y el access_token desde el contexto
  const [formData, setFormData] = useState<Transaction>({
    monto: transaction?.monto || 0,
    fecha: transaction?.fecha || new Date().toISOString().split('T')[0], // Fecha actual por defecto
    descripcion: transaction?.descripcion || '',
    tipo: transaction?.tipo || 'GASTO',
    categoria: transaction?.categoria || undefined,
    usuario: user?.id, // Usamos el ID del usuario

  });

  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Estado para almacenar las categorías
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Efecto para cargar las categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categorias/', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar las categorías');
        }

        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (access_token) {
      fetchCategorias();
    }
  }, [access_token]);

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
  }, [transaction, user]);
 


  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Resetear el error antes de la petición

    // Verifica que el usuario esté autenticado
    if (!user || !access_token) {
      setError('Usuario no autenticado. Por favor, inicia sesión.');
      return;
    }

    try {
      if (transaction?.id) {
        // Si existe un ID, estamos editando una transacción existente
        await updateTransaction(transaction.id, formData, access_token);
      } else {
        // Si no existe un ID, estamos creando una nueva transacción
        await createTransaction(formData, access_token);
      }

      // Llamar a la función de éxito si está definida
      if (onSubmitSuccess) {
        onSubmitSuccess();
       // router.push("./movimientos"); // Redirige al usuario
      }
    } catch (err) {
      setError(err.message || 'Error al guardar la transacción.');
    }
    router.push("./movimientos"); // Redirige al usuario

  };
  

  // Manejar la eliminación de la transacción
  const handleDelete = async () => {
    if (transaction?.id) {
      try {
        await deleteTransaction(transaction.id, access_token!);

        // Llamar a la función de éxito si está definida
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (err) {
        setError(err.message || 'Error al eliminar la transacción.');
      }
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }} // Ruta de la imagen de fondo
    >
     
      {/* Navbar */}

      <div className="relative min-h-screen flex items-center justify-center">
      
      {/* Formulario */}
      <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-2xl w-full my-8">
      <div className="mb-6">
      {/* Logo */}
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  {" "}
                   <img
          src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user}`}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-sm"
        />
                  <span className="text-gray-900 dark:text-yellow-400 group-hover:underline">
                    {user?.user || "Invitado"}
                  </span>
                </h1>
 
    </div>
      <form
        onSubmit={handleSubmit}
        
      >
        {/* Campos del formulario */}
        {[
          { label: "Monto", value: formData.monto, name: "monto", type: "" },
          { label: "Fecha", value: formData.fecha, name: "fecha", type: "date" },
          { label: "Descripción (opcional)", value: formData.descripcion, name: "descripcion", type: "textarea" },
        ].map(({ label, value, name, type }) => (
          <div className="w-full" key={name}>
            <label className="text-sm font-medium   text-gray-700">{label}</label>
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
           
            <option value="GASTO">Gasto</option>
            <option value="INGRESO">Ingreso</option>
          </select>
        </div>

        {/* Categoría */}
        <div className="w-full">
          <label className="text-sm font-medium text-gray-700">Categoría (opcional)</label>
          <select
            name="categoria"
            value={formData.categoria || ""}
            onChange={handleChange}
            className="border p-3 w-full rounded-md border-gray-300 shadow-sm mb-5"
          >
            <option value="">Selecciona una categoría</option>
            {categorias
              .filter((categoria) => {
                if (formData.tipo === 'INGRESO') {
                  return categoria.nombre === 'Salario' || categoria.nombre === 'Otros ingresos';
                } else {
                  return categoria.nombre !== 'Salario' && categoria.nombre !== 'Otros ingresos';
                }
              })
              .map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
          </select>
        </div>

        {/* Botones */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-700 transition duration-300"
        >
          {transaction ? "Guardar Cambios" : "Crear Transacción"}
        </button>

        {transaction && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-red-600 transition duration-300 mt-4"
          >
            Eliminar
          </button>
        )}

        {/* Mostrar errores */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>
    </div>
    </div>
    </div>
    </div>
  );
};

export default TransactionForm;






