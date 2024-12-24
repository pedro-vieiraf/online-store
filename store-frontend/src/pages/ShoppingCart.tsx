import { useContext } from "react";
import Context from "../context/Context";
import { CartProduct, Product } from "../types";
import axios from "axios";

function ShoppingCart() {
    const { cart, setCart, id, token } = useContext(Context);

    function groupCartItems(cart: Product[]): (Product & { quantity: number })[] {
        const groupedItems: { [key: number]: Product & { quantity: number } } = {};
    
        cart.forEach((item) => {
            if (groupedItems[item.id]) {
                groupedItems[item.id].quantity += 1;
            } else {
                groupedItems[item.id] = { ...item, quantity: 1 };
            }
        });

        return Object.values(groupedItems);
    }
    const handleCheckout = async () => {
        const address = import.meta.env.VITE_BACKEND_URL;
        const updatedCart = groupCartItems(cart);

        try {
            const salesData = updatedCart.map((product: CartProduct) => ({
                customerId: id,
                productId: product.id,
                quantity: product.quantity
            }))  
   
            await Promise.all(
                salesData.map((sale) =>
                    axios.post(`${address}/sales`, sale, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }),                   
                )
            );
            setCart([])
        } catch (err) {
            console.error('Error checking out:', err)
        }
    }
    
    const handleRemove = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    }

    const totalPrice = cart.reduce((acc: number, product: Product) => acc += product.price, 0);

    return (
        <main className="pt-20 min-h-screen bg-white text-gray-900 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-center text-saffron-600 mb-8">Shopping Cart</h1>
      
            {cart.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
            ) : (
              <>
                <ul className="space-y-6">
                  {cart.map((product: Product, index: number) => (
                    <li key={index} className="bg-white border rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-300">
                      <h2 className="text-2xl font-semibold text-saffron-600">{product.name}</h2>
                      <p className="text-gray-500 text-sm mb-2">{product.description}</p>
                      <p className="text-gray-800 text-lg font-medium mb-4">Price: <span className="text-saffron-200">${product.price}</span></p>
                      <button
                        onClick={() => handleRemove(index)}
                        className="text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg px-4 py-2 font-medium transition duration-300"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
      
                <div className="mt-8 text-right">
                  <p className="text-2xl font-semibold">Total: <span className="text-saffron-200">${totalPrice}</span></p>
                </div>
              </>
            )}
      
            <div className="mt-8 text-center">
              <button
                onClick={handleCheckout}
                className="w-full md:w-1/3 text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg py-3 font-medium transition duration-300"
              >
                Checkout
              </button>
            </div>
          </div>
        </main>
      );
      
}

export default ShoppingCart