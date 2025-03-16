"use client";

import React, { useState } from 'react';
import TransactionForm from '../component/TransactionForm'; // Importa el componente del formulario
import { useTransactions } from '../contex/TransactionContex'; // Importa el contexto de transacciones
import { Transaction } from '../../types/transaction'; // Importa el tipo de transacción
import { useUser } from '../contex/UserContex'; // Importa el contexto del usuario



const TransaccionesComponent = () => {

  // Obtén las funciones y el estado del contexto de transacciones
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  // Obtén el usuario autenticado desde el contexto
  const { user } = useUser();

  // Estado para manejar la transacción seleccionada (edición)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Función para manejar el envío del formulario (crear o editar)
  const handleSubmit = (transactionData: Omit<Transaction, 'id'>) => {
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

     // Agrega el ID del usuario a los datos de la transacción
     const transactionWithUser = {
      ...transactionData,
      usuario: user.id, // Incluye el ID del usuario
    };
    console.log("desde page transaccion",user.id)

    if (selectedTransaction) {
      // Si hay una transacción seleccionada, edítala
      updateTransaction(selectedTransaction.id, transactionWithUser);
    } else {
      // Si no hay una transacción seleccionada, créala
      addTransaction(transactionWithUser);
    }
    setSelectedTransaction(null); // Limpia la selección después de guardar
  };

  // Función para manejar la eliminación de una transacción
  const handleDelete = (transactionId: number) => {
    deleteTransaction(transactionId); // Llama a la función del contexto para eliminar la transacción
    setSelectedTransaction(null); // Limpia la selección después de eliminar
  };

  return (
    <div >
    
      {/* Formulario para crear/editar transacciones */}
      <TransactionForm
        transaction={selectedTransaction} // Pasa la transacción seleccionada (si existe)
        onSubmit={handleSubmit} // Pasa la función para manejar el envío del formulario
        onDelete={selectedTransaction ? handleDelete : undefined} // Pasa la función para eliminar (si hay una transacción seleccionada)
      />
      {/* Lista de transacciones con opciones para editar/eliminar */}
      
    </div>
  );
};

export default TransaccionesComponent;