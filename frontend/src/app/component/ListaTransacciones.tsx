import { useEffect, useState } from "react";
import { useUser } from "../contex/UserContex";

interface TransaccionList {
    id: number;
    monto: string;
    fecha: string;
    descripcion: string;
    tipo: string;
    categoria: number | null;
    categoria_nombre: string;
    usuario: number;
    usuario_username: string;
}

const TransaccionesListComponent = () => {
    const [transacciones, setTransacciones] = useState<TransaccionList[]>([]);
    const { access_token, user } = useUser();

    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/transacciones/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data: TransaccionList[] = await response.json();
                setTransacciones(data);
            } catch (error) {
                console.error("Error al obtener transacciones:", error);
            }
        };

        fetchTransacciones();
    }, []);

    return (
        <div>
            <h2>Lista de Transacciones</h2>
            <ul>
                {transacciones.map((transaccion) => (
                    <li key={transaccion.id}>
                        {transaccion.fecha} - {transaccion.monto} ({transaccion.tipo})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransaccionesListComponent;
