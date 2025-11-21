import ProductList from '../../components/ProductList';


export default function ProductsPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Catálogo de Productos</h1>
      <div className="row g-4">
        <ProductList />
      </div>
    </div>
  );
}