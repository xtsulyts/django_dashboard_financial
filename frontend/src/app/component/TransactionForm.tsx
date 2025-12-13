"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../contex/UserContex';
import { createTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';
import { useRouter } from 'next/navigation';

type Transaction = {
  id?: number;
  monto: number;
  fecha: string;
  descripcion?: string;
  tipo: 'INGRESO' | 'GASTO';
  categoria?: number;
  usuario?: number;
};

type Categoria = {
  id: number;
  nombre: string;
  descripcion?: string;
};

type TransactionFormProps = {
  transaction?: Transaction;
  onSubmitSuccess?: () => void;
  onDeleteSuccess?: () => void;
};

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSubmitSuccess, onDeleteSuccess }) => {
  const { user, access_token } = useUser();
  const router = useRouter();
  
  const [formData, setFormData] = useState<Transaction>({
    monto: transaction?.monto || 0,
    fecha: transaction?.fecha || new Date().toISOString().split('T')[0],
    descripcion: transaction?.descripcion || '',
    tipo: transaction?.tipo || 'GASTO',
    categoria: transaction?.categoria || undefined,
    usuario: user?.id,
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categorias/', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar las categorías: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido al cargar las categorías');
        }
      }
    };

    if (access_token) {
      fetchCategorias();
    }
  }, [access_token]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        monto: transaction.monto,
        fecha: transaction.fecha,
        descripcion: transaction.descripcion,
        tipo: transaction.tipo,
        categoria: transaction.categoria,
        usuario: user?.id,
      });
    }
  }, [transaction, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monto' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user || !access_token) {
      setError('Usuario no autenticado. Por favor, inicia sesión.');
      setIsLoading(false);
      return;
    }

    try {
      if (transaction?.id) {
        await updateTransaction(transaction.id, formData, access_token);
      } else {
        await createTransaction(formData, access_token);
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      router.push("./movimientos");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al guardar la transacción.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (transaction?.id && access_token) {
      try {
        await deleteTransaction(transaction.id, access_token);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al eliminar la transacción.');
        }
      }
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }}
    >
      {/* Overlay con opacidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/10 backdrop-blur-[1px]"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Tarjeta del formulario */}
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-gray-700/40">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-emerald-500/90 to-cyan-500/90 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
                  </h1>
                  <p className="text-emerald-100">
                    {transaction ? 'Modifica los datos de tu transacción' : 'Registra un nuevo ingreso o gasto'}
                  </p>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user || 'default'}`}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white/50"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{user?.user || 'Invitado'}</p>
                    <p className="text-xs text-emerald-100">Activo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-400 font-medium flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">💰</span>
                      Monto
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </div>
                    <input
                      type="number"
                      name="monto"
                      value={formData.monto}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">📅</span>
                      Fecha
                    </span>
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center">
                    <span className="mr-2">📝</span>
                    Descripción (opcional)
                  </span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none resize-none"
                  placeholder="Describe tu transacción..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">📊</span>
                      Tipo de transacción
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tipo: 'INGRESO' }))}
                      className={`py-3.5 rounded-xl border-2 transition-all ${formData.tipo === 'INGRESO' 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                        : 'border-gray-300 dark:border-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      <span className="text-lg mr-2">⬆️</span>
                      Ingreso
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tipo: 'GASTO' }))}
                      className={`py-3.5 rounded-xl border-2 transition-all ${formData.tipo === 'GASTO' 
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' 
                        : 'border-gray-300 dark:border-gray-700 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-lg mr-2">⬇️</span>
                      Gasto
                    </button>
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">🏷️</span>
                      Categoría
                    </span>
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none"
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
              </div>

              {/* Botones de acción */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Procesando...
                    </div>
                  ) : (
                    <>
                      <span className="text-lg mr-2">
                        {transaction ? '💾' : '✨'}
                      </span>
                      {transaction ? 'Guardar Cambios' : 'Crear Transacción'}
                    </>
                  )}
                </button>

                {transaction && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-lg mr-2">🗑️</span>
                    Eliminar Transacción
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => router.push('/movimientos')}
                  className="w-full py-3.5 px-6 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-xl transition-colors"
                >
                  <span className="mr-2">←</span>
                  Volver al historial
                </button>
              </div>

              {/* Indicador */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Transacción {formData.tipo === 'INGRESO' ? 'positiva' : 'negativa'}
                  </div>
                  <span className="mx-4">•</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                    {new Date(formData.fecha).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Info adicional */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/90">
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                💡 Tip: Mantén tus transacciones actualizadas para un mejor control
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;