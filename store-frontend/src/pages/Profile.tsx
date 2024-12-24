import { useContext, useEffect, useState } from "react";
import Context from "../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {

    const { loading, setLoading, token, id } = useContext(Context);
    const [profile, setProfile] = useState<null | {
        customer: {
            id: number;
            name: string;
            cpf: number;
        };
        sales: Array<{
            id: number;
            product: {
                name: string;
                description: string;
                price: number;
                quantity: number;
                finalPrice: number;
            };
        }>;
        products: Array<{
            id: number,
          name: string,
          description: string,
          price: number,
        }>;
    }>(null);

    const navigate = useNavigate();

    const handleDeleteProduct = async (productId: number) => {
        try {
            const address = import.meta.env.VITE_BACKEND_URL;
            await axios.delete(`${address}/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setProfile((prevProfile) => {
                if (!prevProfile) return null;
                return {
                    ...prevProfile,
                    products: prevProfile.products.filter((product) => product.id !== productId),
                };
            });
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            try {
                const address = import.meta.env.VITE_BACKEND_URL;
                console.log("passo 1");
                
                const response = await axios.get(`${address}/customers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = response.data;
                setProfile(data);
            } catch (err) {
                console.log('Error fetching data:', err);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        getProfile()
    }, [setProfile, setLoading, token, id])
    
    if(loading) {
        console.log("profile", profile);
        
        return <h1>Loading...</h1>
    }
    if (!profile) return <p>No profile data available</p>;

    return (
        <main className="pt-20 min-h-screen bg-white text-gray-900 p-8">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Customer Information Section */}
            <section className="bg-white border rounded-lg shadow-lg p-6">
              <h2 className="text-3xl font-extrabold text-saffron-600 mb-6">Customer Information</h2>
              <p className="text-lg font-medium text-gray-800"><strong>Name:</strong> {profile.customer.name}</p>
              <p className="text-lg font-medium text-gray-800"><strong>CPF:</strong> {profile.customer.cpf}</p>
            </section>
      
            {/* Sales Section */}
            <section className="bg-white border rounded-lg shadow-lg p-6">
              <h2 className="text-3xl font-extrabold text-saffron-600 mb-6">Sales</h2>
              {profile.sales.length > 0 ? (
                profile.sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="bg-gray-50 border rounded-lg p-4 mb-6 shadow-md hover:shadow-lg transition duration-300"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">{sale.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2"><strong>Description:</strong> {sale.product.description}</p>
                    <p className="text-gray-800"><strong>Price:</strong> ${sale.product.price}</p>
                    <p className="text-gray-800"><strong>Quantity:</strong> {sale.product.quantity}</p>
                    <p className="text-gray-800"><strong>Final Price:</strong> ${sale.product.finalPrice}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">You haven't made any purchases yet.</p>
              )}
            </section>
      
            {/* Products Section */}
            <section className="bg-white border rounded-lg shadow-lg p-6">
              <h2 className="text-3xl font-extrabold text-saffron-600 mb-6">Products</h2>
              {profile.products.length === 0 ? (
                <>
                  <p className="text-gray-600">You haven't published any product yet.</p>
                </>
              ) : (
                <>
                  {profile.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-50 border rounded-lg p-4 mb-6 shadow-md hover:shadow-lg transition duration-300"
                    >
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2"><strong>Description:</strong> {product.description}</p>
                      <p className="text-gray-800"><strong>Price:</strong> ${product.price}</p>
                      <div className="space-x-4 mt-4">
                        <button
                          onClick={() => navigate(`/editProduct/${product.id}`)}
                          className="text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg py-2 px-4 font-medium transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-white bg-red-500 hover:bg-red-600 rounded-lg py-2 px-4 font-medium transition duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div className="mt-6">
                <button
                  onClick={() => navigate('/newProduct')}
                  className="w-full md:w-1/3 text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg py-3 font-medium transition duration-300"
                >
                  Create a new product
                </button>
              </div>
            </section>
          </div>
        </main>
      );
      
}

export default Profile;