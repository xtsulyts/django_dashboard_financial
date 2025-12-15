"use client";

import React, { useState } from 'react';
import TransactionForm from '../component/TransactionForm';
import { Transaction } from '../../types/transaction';

const TransaccionesComponent = () => {
  const [selectedTransaction] = useState<Transaction | null>(null);

  return (
    <div>
      <TransactionForm
        transaction={selectedTransaction || undefined}
      />
    </div>
  );
};

export default TransaccionesComponent;