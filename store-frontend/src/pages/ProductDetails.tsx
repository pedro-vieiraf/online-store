import { useParams } from "react-router-dom";
import { Product } from "../types";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "../context/Context";

function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const { token, setLoading, loading, setCart, cart } = useContext(Context);

    const handleCart = () => { 
        if (!product || product.stock <= 0) {
            console.log("Product not found or out of stock");
            return;
        }

        const newCart = [...cart, product];
        setCart(newCart);

        setProduct({ ...product, stock: product.stock - 1 });
    };

    useEffect(() => {
        async function getProduct() {
            setLoading(true);
            try{
                const address = import.meta.env.VITE_BACKEND_URL;

                const response = await axios.get(`${address}/products/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = response.data;

                const quantityInCart = cart.filter(item => item.id === data.id).length;
                const adjustedProduct = { ...data, stock: data.stock - quantityInCart };

                setProduct(adjustedProduct);
            } catch(err) {
                console.log('Error fetching data:', err);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        getProduct();
    }, [id, token, cart, setLoading]);

    if(!product) {
        return <h1>Product not found</h1>
    }

    if(loading) {
        return <h1>Loading...</h1>
    }

    return (
        <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-8">
          {/* Card do produto */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg shadow-gray-300 p-6 max-w-lg w-full">
            {/* Nome do produto */}
            <h1 className="text-3xl font-extrabold text-saffron-600 mb-4 text-center">
              {product.name}
            </h1>
      
            {/* Descrição */}
            <p className="text-gray-600 text-lg mb-6 text-center">
              {product.description}
            </p>
      
            {/* Preço e estoque */}
            <div className="space-y-2 text-center">
              <p className="text-xl font-medium">
                Price: <span className="text-saffron-200">${product.price}</span>
              </p>
              <p className="text-xl font-medium">
                Stock: <span className="text-saffron-200">{product.stock}</span>
              </p>
            </div>
      
            {/* Botão "Add to cart" */}
            <button
              onClick={handleCart}
              className="mt-6 w-full text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg py-3 font-medium transition duration-300"
            >
              Add to cart
            </button>
          </div>
        </main>
      );
      
}

export default ProductDetails;