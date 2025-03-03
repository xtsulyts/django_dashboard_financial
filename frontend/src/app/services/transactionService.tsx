import axios from 'axios'; // o usar fetch
import { Transaction } from '../../types/transaction'; // Define tus tipos en src/types/
import { useUser } from '../contex/UserContex'; // Asegúrate de importar el hook useUser

const API_URL = 'http://127.0.0.1:8000/api'; // URL de tu backend

// Obtener todas las transacciones de un usuario
export const getTransactions = async (userId: number): Promise<Transaction[]> => {
  const response = await axios.get(`${API_URL}/transacciones/`, {
    params: { usuario: userId }, // Filtra las transacciones por usuario
  });
  return response.data;
};

// Crear una nueva transacción
export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const response = await axios.post(`${API_URL}/transacciones/`, transaction); // Envía los datos al backend
  return response.data;
  
};


// Actualizar una transacción existente
export const updateTransaction = async (
  id: number,
  transaction: Partial<Transaction> // Permite actualizar solo algunos campos
): Promise<Transaction> => {
  const response = await axios.put(`${API_URL}/transacciones/${id}/`, transaction); // Envía los cambios al backend
  return response.data;
};

// Eliminar una transacción
export const deleteTransaction = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/transacciones/${id}/`); // Elimina la transacción en el backend
};