import axios from 'axios'; // o usar fetch
import { Transaction } from '../../types/transaction'; // Define tus tipos en src/types/

const API_URL = 'http://127.0.0.1:8000/api'; // URL de tu backend

// Obtener todas las transacciones de un usuario
export const getTransactions = async (userId: number, access_token: string): Promise<Transaction[]> => {
  if (!access_token) {
    throw new Error("No hay token de acceso. Por favor, inicia sesión.");
  }

  const response = await axios.get(`${API_URL}/transacciones/`, {
    params: { usuario: userId }, // Filtra las transacciones por usuario
    headers: {
      Authorization: `Bearer ${access_token}`, // Incluir el token en los headers
    },
  });

  return response.data;
};

// Crear una nueva transacción
export const createTransaction = async (
  transaction: Omit<Transaction, 'id'>,
  access_token: string
): Promise<Transaction> => {
  if (!access_token) {
    throw new Error("No hay token de acceso. Por favor, inicia sesión.");
  }

  const response = await axios.post(`${API_URL}/transacciones/`, transaction, {
    headers: {
      Authorization: `Bearer ${access_token}`, // Incluir el token en los headers
    },
  });

  return response.data;
};

// Actualizar una transacción existente
export const updateTransaction = async (
  id: number,
  transaction: Partial<Transaction>, // Permite actualizar solo algunos campos
  access_token: string
): Promise<Transaction> => {
  if (!access_token) {
    throw new Error("No hay token de acceso. Por favor, inicia sesión.");
  }

  const response = await axios.put(`${API_URL}/transacciones/${id}/`, transaction, {
    headers: {
      Authorization: `Bearer ${access_token}`, // Incluir el token en los headers
    },
  });

  return response.data;
};

// Eliminar una transacción
export const deleteTransaction = async (id: number, access_token: string): Promise<void> => {
  if (!access_token) {
    throw new Error("No hay token de acceso. Por favor, inicia sesión.");
  }

  await axios.delete(`${API_URL}/transacciones/${id}/`, {
    headers: {
      Authorization: `Bearer ${access_token}`, // Incluir el token en los headers
    },
  });
};






// import axios from 'axios'; // o usar fetch
// import { Transaction } from '../../types/transaction'; // Define tus tipos en src/types/
// import { useUser } from '../contex/UserContex'; // Asegúrate de importar el hook useUser

// const API_URL = 'http://127.0.0.1:8000/api'; // URL de tu backend

// // Obtener todas las transacciones de un usuario
// export const getTransactions = async (userId: number): Promise<Transaction[]> => {
//   const { access_token } = useUser(); // Obtener el access_token desde el contexto

//   if (!access_token) {
//     throw new Error("No hay token de acceso. Por favor, inicia sesión.");
//   }

//   const response = await axios.get(`${API_URL}/transacciones/`, {
//     params: { usuario: userId }, // Filtra las transacciones por usuario
//     headers: {
//       Authorization: `Bearer ${access_token}`, // Incluir el token en los headers
//     },
//   });

//   return response.data;
// };

// // Crear una nueva transacción
// export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
//   const { access_token } = useUser(); // Obtener el access_token desde el contexto

//   if (!access_token) {
//     throw new Error("No hay token de acceso. Por favor, inicia sesión.");
//   }

//   const response = await axios.post(`${API_URL}/transacciones/`, transaction, {
//     headers: {
//       Authorization: `Bearer ${access_token}`, // Incluir el token en los headers
//     },
//   });

//   return response.data;
// };

// // Actualizar una transacción existente
// export const updateTransaction = async (
//   id: number,
//   transaction: Partial<Transaction> // Permite actualizar solo algunos campos
// ): Promise<Transaction> => {
//   const { access_token } = useUser(); // Obtener el access_token desde el contexto

//   if (!access_token) {
//     throw new Error("No hay token de acceso. Por favor, inicia sesión.");
//   }

//   const response = await axios.put(`${API_URL}/transacciones/${id}/`, transaction, {
//     headers: {
//       Authorization: `Bearer ${access_token}`, // Incluir el token en los headers
//     },
//   });

//   return response.data;
// };

// // Eliminar una transacción
// export const deleteTransaction = async (id: number): Promise<void> => {
//   const { access_token } = useUser(); // Obtener el access_token desde el contexto

//   if (!access_token) {
//     throw new Error("No hay token de acceso. Por favor, inicia sesión.");
//   }

//   await axios.delete(`${API_URL}/transacciones/${id}/`, {
//     headers: {
//       Authorization: `Bearer ${access_token}`, // Incluir el token en los headers
//     },
//   });
// };



