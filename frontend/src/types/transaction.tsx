// src/app/types/transaction.ts

// Tipo para una categoría
export type Category = {
    id: number;
    nombre: string;
    descripcion?: string; // Opcional
  };
  
  // Tipo para una transacción
  export type Transaction = {
    id: number;
    monto: number;
    fecha: string; // O puedes usar `Date` si manejas fechas como objetos
    descripcion?: string; // Opcional
    tipo: 'INGRESO' | 'GASTO'; // Solo puede ser "INGRESO" o "GASTO"
    categoria: Category; // Relación con una categoría
    usuario: number; // ID del usuario
  };