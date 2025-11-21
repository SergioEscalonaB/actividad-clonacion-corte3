import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productosService } from "../../services/ecommerce/productos.services";
import type { Producto } from "../../services/ecommerce/productos.services";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchProducto = async () => {
      try {
        setLoading(true);
        const productoData = await productosService.obtenerProductoPorId(Number(id));
        setProducto(productoData);
      } catch (err) {
        setError("No se pudo cargar el producto");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          {error || "Producto no encontrado"}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Imagen */}
        <div className="col-md-6">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded shadow"
            />
          ) : (
            <div
              className="bg-light d-flex align-items-center justify-content-center"
              style={{ height: "300px" }}
            >
              <span className="text-muted">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Información principal */}
        <div className="col-md-6">
          <h1 className="mb-3">{producto.nombre}</h1>
          <p className="text-muted mb-4">{producto.descripcion}</p>

          {/* Detalles clave */}
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <strong>Precio:</strong>
              <span className="text-primary fs-4">${producto.precio.toFixed(2)}</span>
            </div>

            {producto.discountPercentage && producto.discountPercentage > 0 && (
              <div className="d-flex justify-content-between text-muted">
                <span>Descuento:</span>
                <span>{producto.discountPercentage}%</span>
              </div>
            )}

            <div className="d-flex justify-content-between">
              <strong>Marca:</strong>
              <span>{producto.brand || '—'}</span>
            </div>

            <div className="d-flex justify-content-between">
              <strong>Categoría:</strong>
              <span className="text-capitalize">{producto.categoria || '—'}</span>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span>Estado:</span>
              <span
                className={`badge ${
                  producto.stock > 0 ? 'bg-success' : 'bg-danger'
                }`}
              >
                {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
              </span>
            </div>
          </div>

          {/* Política y envío */}
          {producto.shippingInformation && (
            <p className="text-muted small">
              <strong>Envío:</strong> {producto.shippingInformation}
            </p>
          )}
          {producto.warrantyInformation && (
            <p className="text-muted small">
              <strong>Garantía:</strong> {producto.warrantyInformation}
            </p>
          )}
          {producto.returnPolicy && (
            <p className="text-muted small">
              <strong>Devoluciones:</strong> {producto.returnPolicy}
            </p>
          )}

          {/* Botón de carrito */}
          <button
            className="btn btn-primary mt-3"
            disabled={producto.stock === 0}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Sección adicional: Reseñas (opcional) */}
      {producto.reviews && producto.reviews.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <h3>Reseñas ({producto.reviews.length})</h3>
            {producto.reviews.slice(0, 3).map((review, index) => (
              <div key={index} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title mb-1">{review.reviewerName}</h6>
                    <span className="text-warning">
                      {'★'.repeat(Math.floor(review.rating))}
                      {'☆'.repeat(5 - Math.floor(review.rating))}
                    </span>
                  </div>
                  <p className="card-text text-muted small">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}