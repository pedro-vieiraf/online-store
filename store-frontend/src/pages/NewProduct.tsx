import { FormEvent, useContext, useState } from "react";
import Context from "../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewProduct() {

    const { token, id, isSubmitting, setIsSubmitting } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (!formData.name || !formData.description || formData.price <= 0 || formData.stock < 0) {
            setIsSubmitting(false);
        }
        
        const address = import.meta.env.VITE_BACKEND_URL;

        try {
            await axios.post(`${address}/products`, {
                customerId: id,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setIsSubmitting(false);
            navigate("/profile");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    alert('Unauthorized');
                    navigate("/")
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    // adicionar imagem no banco de dados.
    return (
        <main className="pt-20 min-h-screen bg-white text-gray-900 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Título */}
            <h1 className="text-3xl font-extrabold text-saffron-600 mb-6 text-center">
              Product Information:
            </h1>
            
            {/* Formulário de Adição de Produto */}
            <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-lg p-6 space-y-6">
              {/* Imagem */}
              <div>
                <label htmlFor="image" className="block text-lg font-medium text-gray-800 mb-2">
                  Image:
                </label>
                <input
                  type="file"
                  onChange={handleChange}
                  name="image"
                  id="image"
                  accept="image/png, image/jpeg"
                  className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
      
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-800 mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="name"
                  id="name"
                  placeholder="Product name"
                  className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
      
              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-lg font-medium text-gray-800 mb-2">
                  Description:
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="description"
                  id="description"
                  placeholder="Product description"
                  className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
      
              {/* Preço */}
              <div>
                <label htmlFor="price" className="block text-lg font-medium text-gray-800 mb-2">
                  Price: R$
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="price"
                  min="0"
                  step="0.01"
                  id="price"
                  placeholder="Product price"
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
                  onChange={handleChange}
                  name="stock"
                  min="0"
                  id="stock"
                  placeholder="Current stock"
                  className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
      
              {/* Botão de Submissão */}
              <button
                disabled={isSubmitting}
                className="w-full text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg py-3 font-medium transition duration-300"
              >
                {isSubmitting ? "Adding product..." : "Add product"}
              </button>
            </form>
          </div>
        </main>
      );
      
}

export default NewProduct;