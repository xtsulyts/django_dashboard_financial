//src/app/types/transaction.ts

export type Category = {
    id: number;
    nombre: string;
    descripcion?: string;
};


export type Transaction = {
    id: number;
    monto: number;
    fecha: string;
    descripcion?: string;
    tipo: 'INGRESO' | 'GASTO';
    categoria: Category;  // Objeto completo
    usuario: number;
};


export type TransactionInput = {
    monto: number;
    fecha: string;
    descripcion?: string;
    tipo: 'INGRESO' | 'GASTO';
    categoriaId: number;  // Solo el ID
    usuario: number;
};