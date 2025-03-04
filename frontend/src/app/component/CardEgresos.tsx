import React from 'react';
import { Transaction } from '../../types/transaction';

type TransactionCardProps = {
  transaction: Transaction;
};

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h3>{transaction.descripcion}</h3>
      <p>Monto: ${transaction.monto}</p>
      <p>Categoría: {transaction.categoria?.nombre}</p>
    </div>
  );
};

export default TransactionCard;