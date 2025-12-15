"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  getTransactions,
  createTransaction as createTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
} from '../services/transactionService';
import { Transaction } from '../../types/transaction';

// Define el tipo para el contexto de transacciones
type TransactionContextType = {
  transactions: Transaction[];
  loadTransactions: (userId: number, access_token: string) => Promise<void>; // ← Recibe access_token
  addTransaction: (transaction: Omit<Transaction, 'id'>, access_token: string) => Promise<void>; // ← Recibe access_token
  updateTransaction: (id: number, transaction: Partial<Transaction>, access_token: string) => Promise<void>; // ← Recibe access_token
  deleteTransaction: (id: number, access_token: string) => Promise<void>; // ← Recibe access_token
};

// Crea el contexto de transacciones
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Proveedor del contexto de transacciones
export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // NOTA: NO usamos useUser() aquí para evitar dependencia circular

  // Función para cargar las transacciones del usuario
  const loadTransactions = async (userId: number, access_token: string) => {
    // VALIDACIÓN: access_token no puede estar vacío
    if (!access_token) {
      throw new Error("No hay token de acceso. Por favor, inicia sesión.");
    }
    
    const data = await getTransactions(userId, access_token);
    setTransactions(data);
  };

  // Función para agregar una nueva transacción
  const addTransaction = async (transaction: Omit<Transaction, 'id'>, access_token: string) => {
    if (!access_token) {
      throw new Error("No hay token de acceso. Por favor, inicia sesión.");
    }
    
    const newTransaction = await createTransactionService(transaction, access_token);
    setTransactions((prev) => [...prev, newTransaction]);
  };

  // Función para actualizar una transacción existente
  const updateTransaction = async (id: number, transaction: Partial<Transaction>, access_token: string) => {
    if (!access_token) {
      throw new Error("No hay token de acceso. Por favor, inicia sesión.");
    }
    
    const updatedTransaction = await updateTransactionService(id, transaction, access_token);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
    );
  };

  // Función para eliminar una transacción
  const deleteTransaction = async (id: number, access_token: string) => {
    if (!access_token) {
      throw new Error("No hay token de acceso. Por favor, inicia sesión.");
    }
    
    await deleteTransactionService(id, access_token);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Retorna el provider con el contexto
  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loadTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Hook para usar el contexto de transacciones
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions debe ser usado dentro de TransactionProvider');
  }
  return context;
};