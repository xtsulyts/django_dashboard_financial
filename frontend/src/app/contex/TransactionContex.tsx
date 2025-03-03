"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  getTransactions,
  createTransaction as createTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
} from '../services/transactionService'; // Importa los servicios necesarios
import { Transaction } from '../../types/transaction'; // Importa el tipo de transacción

// Define el tipo para el contexto de transacciones
type TransactionContextType = {
  transactions: Transaction[]; // Lista de transacciones
  loadTransactions: (userId: number) => Promise<void>; // Cargar transacciones
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>; // Agregar una transacción
  updateTransaction: (id: number, transaction: Partial<Transaction>) => Promise<void>; // Actualizar una transacción
  deleteTransaction: (id: number) => Promise<void>; // Eliminar una transacción
};

// Crea el contexto de transacciones
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Proveedor del contexto de transacciones
export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Estado para almacenar las transacciones

  // Función para cargar las transacciones del usuario
  const loadTransactions = async (userId: number) => {
    const data = await getTransactions(userId); // Llama al servicio para obtener las transacciones
    setTransactions(data); // Actualiza el estado con las transacciones cargadas
  };

  // Función para agregar una nueva transacción
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = await createTransactionService(transaction); // Llama al servicio para crear la transacción
    setTransactions((prev) => [...prev, newTransaction]); // Agrega la nueva transacción al estado
  };

  // Función para actualizar una transacción existente
  const updateTransaction = async (id: number, transaction: Partial<Transaction>) => {
    const updatedTransaction = await updateTransactionService(id, transaction); // Llama al servicio para actualizar la transacción
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)) // Actualiza la transacción en el estado
    );
  };

  // Función para eliminar una transacción
  const deleteTransaction = async (id: number) => {
    await deleteTransactionService(id); // Llama al servicio para eliminar la transacción
    setTransactions((prev) => prev.filter((t) => t.id !== id)); // Elimina la transacción del estado
  };

  // Provee el contexto con las transacciones y las funciones
  return (
    <TransactionContext.Provider
      value={{ transactions, loadTransactions, addTransaction, updateTransaction, deleteTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Hook personalizado para usar el contexto de transacciones
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider'); // Lanza un error si el hook se usa fuera del proveedor
  }
  return context;
};