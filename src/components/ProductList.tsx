import { useState, useEffect } from 'react';
import { productosService } from '../services/ecommerce/productos.services';
import type { Producto } from '../services/ecommerce/productos.services';
import ProductCard from './ProductCard';

export default function ProductList() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productosService.obtenerProductos();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (productos.length === 0) {
    return <p className="text-center py-5">No se encontraron productos.</p>;
  }

  return (
    <>
      {productos.map((producto) => (
        <div key={producto.id} className="col-md-4 col-lg-3 mb-4">
          <ProductCard producto={producto} />
        </div>
      ))}
    </>
  );
}