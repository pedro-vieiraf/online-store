import { useContext, useEffect } from "react";
import Context from "../context/Context";
import { Product } from "../types";
import axios from 'axios';
import { Link } from "react-router-dom";

function ProductsPage() {

    const { products, setProducts, token, loading, setLoading, cart, setCart } = useContext(Context);

    const handleCart = async (productId: number) => { 
        try {
            const productIndex = products.findIndex(product => product.id === productId);
            if (productIndex === -1 || products[productIndex].stock <= 0) {
                console.log('Produto fora de estoque');
                return;
            }
    
            const updatedProduct = { ...products[productIndex], stock: products[productIndex].stock - 1 };
            
            const updatedProducts = [...products];
            updatedProducts[productIndex] = updatedProduct;
            setProducts(updatedProducts);
            setCart([...cart, updatedProduct]);
            
        } catch (err) {
            console.log('Erro ao adicionar produto ao carrinho:', err);
            console.error(err);
        }
    };

    useEffect(() => {
        async function getProducts() {
            setLoading(true);
            try {
                const address = import.meta.env.VITE_BACKEND_URL;
                
                const response = await axios.get(`${address}/products`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                const data = response.data;
                
                const cartCountMap: { [id: number]: number } = {};
                cart.forEach((item) => {
                    cartCountMap[item.id] = (cartCountMap[item.id] || 0) + 1;
                });
    
                const updatedData = data.map((product: Product) => {
                    const cartQuantity = cartCountMap[product.id] || 0;
                    return { ...product, stock: product.stock - cartQuantity };
                });
                setProducts(updatedData);
                
            } catch (err) {
                console.log('Error fetching data:', err);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        getProducts()
    }, [setProducts, setLoading, token, cart])
    
    if(loading) {
        return <h1>Loading...</h1>
    }

    return (
        <main className="pt-14 text-gray-900 min-h-screen bg-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold leading-tight tracking-wide text-center pb-8 pt-5 text-gray-800">Products Page</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: Product) => (                  
                <div key={product.id} className="border border-gray-300 p-6 rounded-lg shadow-lg flex flex-col justify-between transition transform hover:scale-105 bg-white">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-gray-800">Price: <span className="text-saffron-200">${product.price}</span></p>
                    <p className="font-medium text-gray-800">Stock: <span className="text-saffron-200">{product.stock}</span></p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="text-saffron-200 hover:text-saffron-400 text-sm underline"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleCart(product.id)}
                      className="w-full text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg py-2 font-medium transition duration-300"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      );
      
}

export default ProductsPage