"use client";

import React, { useState } from 'react';
import TransactionForm from '../component/TransactionForm';
import { useTransactions } from '../contex/TransactionContex';
import { Transaction } from '../../types/transaction';
import { useUser } from '../contex/UserContex';
import { useRouter } from "next/navigation"

const TransaccionesComponent = () => {
  const router = useRouter()
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { user } = useUser();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleSubmit = (transactionData: Omit<Transaction, 'id'>) => {
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    const transactionWithUser = {
      ...transactionData,
      usuario: user.id,
    };
    
    if (selectedTransaction) {
      updateTransaction(selectedTransaction.id, transactionWithUser);
    } else {
      addTransaction(transactionWithUser);
    }
    setSelectedTransaction(null);
    router.push("./movimientos");
  };

  const handleDelete = (transactionId: number) => {
    deleteTransaction(transactionId);
    setSelectedTransaction(null);
  };

  return (
    <div>
      {/* SOLUCIÓN: Añade || undefined aquí */}
     <TransactionForm
        transaction={selectedTransaction || undefined}
      />
    </div>
  );
};

export default TransaccionesComponent;