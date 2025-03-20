import { useEffect, useState } from "react";
import { useUser } from "../contex/UserContex";

interface Transaccion {
    id: number;
    monto: string;
    fecha: string;
    descripcion: string;
    tipo: string;
    usuario : number;
    nombre : string;
    categoria : number 
}

const categorias: { [key: number]: string } = {
    1: "Salario",
    2: "Otros ingresos ",
    3: "Entreteniiento",
    4: "Salud",
    5: "Transporte",
    6: "Servicios",   
};

const TransaccionesListComponent = () => {
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { access_token } = useUser();

    useEffect(() => {
        const fetchTransacciones = async () => {
            if (!access_token) return;

            try {
                const response = await fetch("http://localhost:8000/api/transacciones/", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data: Transaccion[] = await response.json();
                setTransacciones(data);
            } catch (error) {
                setError("Error al obtener transacciones");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransacciones();
    }, [access_token]);

    //if (loading) return <h1>Tienes que estar logeado para poder ver movimientos...</h1>;
    //if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div
          className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4"
          style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }} // Fondo con imagen
        >
          {/* Contenedor de las transacciones */}
          <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-6xl w-full my-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Mis Transacciones</h2>
      
            {transacciones.length === 0 ? (
              <p className="text-gray-600 text-center">No hay transacciones registradas.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {transacciones.map((transaccion) => (
                  <div
                    key={transaccion.id}
                    className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-md text-gray-800"
                  >
                    <p className="text-lg font-semibold">{transaccion.descripcion}</p>
                    <p className="text-gray-700">
                      <strong>Monto:</strong> ${transaccion.monto} <br />
                      <strong>Tipo:</strong> {transaccion.tipo} <br />
                      <strong>Fecha:</strong> {transaccion.fecha} <br />
                      <strong>Usuario:</strong> {transaccion.usuario} <br />
                      <strong>Categoría:</strong> {categorias[transaccion.categoria] || "Desconocida"} {/* Usa el mapeo de categorías */}
                      
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
      
};

export default TransaccionesListComponent;
