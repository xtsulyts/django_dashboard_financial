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


// import { useEffect, useState, useMemo, useCallback } from "react";
// import { useUser } from "../contex/UserContex";

// interface Transaccion {
//   id: number;
//   monto: string;
//   fecha: string;
//   descripcion: string;
//   tipo: string;
//   usuario: number;
//   nombre: string;
//   categoria: number;
// }

// const TransaccionesListComponent = () => {
//   const { access_token, user } = useUser();
//   const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [categories, setCategories] = useState<Record<number, string>>({});
//   const [filters, setFilters] = useState({
//     tipo: '',
//     categoria: '',
//     fechaDesde: '',
//     fechaHasta: ''
//   });

//   const fetchTransacciones = useCallback(async () => {
//     if (!access_token) return;

//     try {
//       setLoading(true);
//       const query = new URLSearchParams({
//         page: page.toString(),
//         ...(filters.tipo && { tipo: filters.tipo }),
//         ...(filters.categoria && { categoria: filters.categoria }),
//         ...(filters.fechaDesde && { fecha_desde: filters.fechaDesde }),
//         ...(filters.fechaHasta && { fecha_hasta: filters.fechaHasta })
//       }).toString();

//       const response = await fetch(`http://localhost:8000/api/transacciones/?${query}`, {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }

//       const data: Transaccion[] = await response.json();
//       setTransacciones(prev => page === 1 ? data : [...prev, ...data]);
//       setHasMore(data.length > 0);
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Error al obtener transacciones");
//     } finally {
//       setLoading(false);
//     }
//   }, [access_token, page, filters]);

//   const fetchCategories = useCallback(async () => {
//     if (!access_token) return;

//     try {
//       const response = await fetch("http://localhost:8000/api/categorias/", {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//         },
//       });
//       const data = await response.json();
//       const categoriesMap = data.reduce((acc: Record<number, string>, cat: any) => {
//         acc[cat.id] = cat.nombre;
//         return acc;
//       }, {});
//       setCategories(categoriesMap);
//     } catch (error) {
//       console.error("Error al obtener categorías:", error);
//     }
//   }, [access_token]);

//   useEffect(() => {
//     if (user) {
//       setPage(1);
//       Promise.all([fetchTransacciones(), fetchCategories()]);
//     }
//   }, [user, filters, fetchTransacciones, fetchCategories]);

//   useEffect(() => {
//     const interval = setInterval(fetchTransacciones, 30000);
//     return () => clearInterval(interval);
//   }, [fetchTransacciones]);

//   const filteredTransactions = useMemo(() => {
//     return transacciones.filter(t => 
//       (filters.tipo ? t.tipo === filters.tipo : true) &&
//       (filters.categoria ? t.categoria === Number(filters.categoria) : true)
//     );
//   }, [transacciones, filters]);

//   if (loading && page === 1) return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {[...Array(6)].map((_, i) => (
//         <div key={i} className="bg-gray-200 h-32 rounded-lg animate-pulse"></div>
//       ))}
//     </div>
//   );

//   if (error) return (
//     <div className="text-red-500 p-4 text-center">
//       {error}
//       <button 
//         onClick={fetchTransacciones}
//         className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded"
//       >
//         Reintentar
//       </button>
//     </div>
//   );

//   return (
//     <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4">
//       <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-6xl w-full my-8">
//         <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
//           Transacciones de {user?.username || 'Usuario'}
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <select 
//             value={filters.tipo}
//             onChange={(e) => setFilters({...filters, tipo: e.target.value})}
//             className="p-2 border rounded"
//           >
//             <option value="">Todos los tipos</option>
//             <option value="ingreso">Ingresos</option>
//             <option value="gasto">Gastos</option>
//           </select>

//           <select 
//             value={filters.categoria}
//             onChange={(e) => setFilters({...filters, categoria: e.target.value})}
//             className="p-2 border rounded"
//           >
//             <option value="">Todas las categorías</option>
//             {Object.entries(categories).map(([id, name]) => (
//               <option key={id} value={id}>{name}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={filters.fechaDesde}
//             onChange={(e) => setFilters({...filters, fechaDesde: e.target.value})}
//             className="p-2 border rounded"
//             placeholder="Desde"
//           />

//           <input
//             type="date"
//             value={filters.fechaHasta}
//             onChange={(e) => setFilters({...filters, fechaHasta: e.target.value})}
//             className="p-2 border rounded"
//             placeholder="Hasta"
//           />
//         </div>

//         {filteredTransactions.length === 0 ? (
//           <p className="text-gray-600 text-center">
//             {Object.values(filters).some(f => f) 
//               ? "No hay transacciones que coincidan con los filtros" 
//               : "No hay transacciones registradas."}
//           </p>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {filteredTransactions.map((transaccion) => (
//                 <div
//                   key={transaccion.id}
//                   className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-md text-gray-800"
//                 >
//                   <p className="text-lg font-semibold">{transaccion.descripcion}</p>
//                   <p className="text-gray-700">
//                     <strong>Monto:</strong> ${transaccion.monto} <br />
//                     <strong>Tipo:</strong> {transaccion.tipo} <br />
//                     <strong>Fecha:</strong> {new Date(transaccion.fecha).toLocaleDateString()} <br />
//                     <strong>Categoría:</strong> {categories[transaccion.categoria] || "Desconocida"}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {hasMore && (
//               <button
//                 onClick={() => setPage(p => p + 1)}
//                 disabled={loading}
//                 className="mt-6 mx-auto block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
//               >
//                 {loading ? 'Cargando...' : 'Cargar más'}
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TransaccionesListComponent;