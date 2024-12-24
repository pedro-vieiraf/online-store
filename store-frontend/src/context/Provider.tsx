import { useState } from "react";
import Context from "./Context"
import { Product } from "../types";

type ProviderProps = {
    children : React.ReactNode
}

export type ProviderValues = {
    user: string;
    setUser: (email: string) => void;
    setToken: React.Dispatch<React.SetStateAction<string>>
    token: string;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    isSubmitting: boolean;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    onLogin: (email: string, token: string, id: number) => void;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    cart: Product[];
    setCart: React.Dispatch<React.SetStateAction<Product[]>>
    cpf: string;
    setCPF: React.Dispatch<React.SetStateAction<string>>
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>
    id: number;
    setId: React.Dispatch<React.SetStateAction<number>>
}

function Provider({ children } : ProviderProps) {

    const [user, setUser] = useState("");
    const [id, setId] = useState(0);
    const [token, setToken] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [cart, setCart] = useState<Product[]>([]);
    const [cpf, setCPF] = useState('');
    const [name, setName] = useState('');

    const onLogin = (email: string, token: string, id: number) => {
        setUser(email);
        setId(id);
        setToken(token);
    }

    const values = {
        user,
        setUser,
        token,
        setToken,
        email,
        setEmail,
        products,
        setProducts,
        cart,
        setCart,
        isSubmitting,
        setIsSubmitting,
        loading,
        setLoading,
        onLogin,
        cpf,
        setCPF,
        name,
        setName,
        id,
        setId
    }

    return(
    <Context.Provider value={values}>
        {children}
    </Context.Provider>)
}

export default Provider;