import axios from "axios";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import Context from "../context/Context";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const { email, setEmail, onLogin, cpf, setCPF, name, setName } = useContext(Context);
    const [error, setError] = useState("")
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleChange = ({ target } : ChangeEvent<HTMLInputElement>) : void => {
        if(target.name === 'email') {
            setEmail(target.value);
        } 
        if(target.name === 'password') {
            setPassword(target.value);
        }
        if(target.name === 'cpf') {
            setCPF(target.value);
        }
        if(target.name === 'name') {
            setName(target.value);
        }
        setError("");
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const address = import.meta.env.VITE_BACKEND_URL;

        try {
          setError('');
            const response = await axios.post(`${address}/register`, {
                email,
                password
            });
            const token = response.data.token.token;
            const id = response.data.user.id;
            
            onLogin(email, token, id);

            await axios.post(`${address}/customers`, {
                name,
                userId: id,
                cpf
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setPassword('')
            navigate('/products');
        } catch (err) {
          if (axios.isAxiosError(err) && err.response) {
            if (err.response.status === 400 || err.response.status === 422) {
                setError("Registration failed. Try again.");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } else {
            setError("Network error. Please check your connection.");
        }
      }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="rounded-lg mt-0 max-w-md bg-white shadow-lg border border-gray-200">
            <div className="p-6 space-y-4 sm:p-8 text-left">
              <h1 className="text-2xl font-extrabold text-saffron-600 leading-tight text-center">
                Create Account
              </h1>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-800">
                    Your Name
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    className="border border-gray-300 rounded-lg block w-full p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                  />
                </div>
      
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">
                    Your Email
                  </label>
                  <input
                    type="email"
                    onChange={handleChange}
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    className="border border-gray-300 rounded-lg block w-full p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                  />
                </div>
      
                {/* CPF */}
                <div>
                  <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-800">
                    Your CPF
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="cpf"
                    id="cpf"
                    placeholder="Enter your CPF"
                    className="border border-gray-300 rounded-lg block w-full p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                  />
                </div>
      
                {/* Senha */}
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-800">
                    Your Password
                  </label>
                  <input
                    type="password"
                    onChange={handleChange}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className="border border-gray-300 rounded-lg block w-full p-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-400"
                  />
                </div>
                {/* Mensagem de Erro */}
                {error && (
                            <p className="text-red-500 text-sm font-medium text-center mt-2">
                                {error}
                            </p>
                )}
                {/* Botão de Registro */}
                <button className="w-full text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg py-2 px-5 font-medium">
                  Register
                </button>
              </form>
      
              {/* Link para Login */}
              <p className="text-sm font-light text-gray-600">
                Already registered?{" "}
                <Link to="/" className="text-saffron-200 hover:text-saffron-400 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
      
}

export default Register