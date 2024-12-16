import { ChangeEvent, FormEvent, useContext, useState } from "react"
import Context from "../context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

function Login() {

    const { onLogin, email, setEmail } = useContext(Context);
    const [error, setError] = useState("")
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleChange = ({ target } : ChangeEvent<HTMLInputElement>) : void => {
        if(target.name === 'email') {
            setEmail(target.value)
        } else{
            setPassword(target.value);
        }
        setError("");
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const address = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await axios.post(`${address}/login`, {
                email,
                password
            });
            
            const token = response.data.token.token;
            const id = response.data.user.id;
            onLogin(email, token, id);
            setPassword('');
            navigate('/products');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 400 || err.response.status === 422) {
                    setError("Invalid login credentials. Please try again.");
                } else {
                    setError("Something went wrong. Please try again later.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="rounded-lg mt-0 max-w-md bg-white border border-gray-300">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-left"> 
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                        Sign in to your account
                    </h1>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
                            <input
                                type="email"
                                onChange={handleChange}
                                name="email"
                                id="email"
                                placeholder="Enter your email address"
                                className="border rounded-lg block w-full p-2.5 focus:outline-none focus:border-saffron-300 focus:ring-2 focus:ring-saffron-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                            <input
                                type="password"
                                onChange={handleChange}
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="border rounded-lg block w-full p-2.5 focus:outline-none focus:border-saffron-300 focus:ring-2 focus:ring-saffron-100"
                            />
                        </div>
                        {error && (
                            <div className="text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        <button className="w-full text-white bg-saffron-200 hover:bg-saffron-400 rounded-lg py-2 px-5 font-medium">
                            Sign In
                        </button>
                        <p className="text-sm font-light">
                            Don't have an account yet?{" "}
                            <Link to="/register" className="text-saffron-200 hover:text-saffron-500 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login