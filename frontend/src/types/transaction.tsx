// src/app/types/transaction.ts

export type Category = {
    id: number;
    nombre: string;
    descripcion?: string;
};

// Tipo para CUANDO RECIBES datos (GET)
export type Transaction = {
    id: number;
    monto: number;
    fecha: string;
    descripcion?: string;
    tipo: 'INGRESO' | 'GASTO';
    categoria: Category;  // Objeto completo
    usuario: number;
};

// NUEVO: Tipo para CUANDO ENVÍAS datos (POST/PUT)
export type TransactionInput = {
    monto: number;
    fecha: string;
    descripcion?: string;
    tipo: 'INGRESO' | 'GASTO';
    categoria: number;  // Solo el ID
    usuario: number;
};