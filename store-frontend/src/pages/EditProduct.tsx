import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Context from "../context/Context";
import axios from "axios";
import { Product } from "../types";

function EditProduct() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const { token, setLoading, loading } = useContext(Context);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0
    });
    const navigate = useNavigate();

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

                setProduct(data);
                setFormData({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    stock: data.stock
                })
            } catch (err) {
                console.log('Error fetching data:', err);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        getProduct();
    }, [id, token, setLoading]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const address = import.meta.env.VITE_BACKEND_URL;
            await axios.put(`${address}/products/${id}`, {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            navigate("/profile");
        } catch (err) {
            console.error('Error updating product:', err);
        } finally {
            setLoading(false);
        }
    };


    if(!product) {
        return <h1>Product not found</h1>
    }

    if(loading) {
        return <h1>Loading...</h1>
    }

    return (
        <main className="pt-20 min-h-screen bg-white text-gray-900 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Título */}
            <h1 className="text-3xl font-extrabold text-saffron-600 mb-6 text-center">
              Edit Product:
            </h1>
            
            {/* Formulário de Edição */}
            <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-lg p-6 space-y-6">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-800 mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
      
              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-lg font-medium text-gray-800 mb-2">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                ></textarea>
              </div>
      
              {/* Preço */}
              <div>
                <label htmlFor="price" className="block text-lg font-medium text-gray-800 mb-2">
                  Price:
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
      
              {/* Estoque */}
              <div>
                <label htmlFor="stock" className="block text-lg font-medium text-gray-800 mb-2">
                  Stock:
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
      
              {/* Botão de Submissão */}
              <button
                disabled={loading}
                className="w-full text-white bg-saffron-500 hover:bg-saffron-600 rounded-lg py-3 font-medium transition duration-300"
              >
                {loading ? "Editing product..." : "Save Changes"}
              </button>
            </form>
          </div>
        </main>
      );
      
}

export default EditProduct