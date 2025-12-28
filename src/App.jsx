import { useEffect, useState, useRef, createContext } from "react";
import NavBar from "./components/NavBar";
import { createClient } from '@supabase/supabase-js'
import ShoppingCartMenu from "./components/ShoppingCartMenu";
import ProductCard from "./components/ProductCard";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

const supabaseUrl = 'https://ikqlvnaqasirwjhgrxbd.supabase.co'
const supabaseKey = 'sb_publishable_QKUgd_7ebOKUCsnXlc_wwA_m09ekffz'
const supabaseClient = createClient(supabaseUrl, supabaseKey)
export const ShoppingCartContext = createContext({})
export const UserContext = createContext({})

function App() {
  const [user, setUser] = useState({});
  const [shoppingCart, setShoppingCart] = useState({})
  const [products, setProducts] = useState([])
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeUserSettings();
    }

    loadProducts()
  }, []);

  async function initializeUserSettings() {
    const selectedUser = await getFisrtRandomUserUser();

    if (selectedUser) {
      const { data, error } = await supabaseClient
        .from('carrello')
        .select(`
          id_carrello,
          prezzo_totale,
          dettagli_del_carrello (
            quantità,
            prezzo_parziale,
            prodotto (
              nome,
              prezzo,
              categoria
            )
          )
        `)
        .eq('E-mail', selectedUser["E-mail"]);

      if (error) {
        console.log("Errore nel caricamento del carrello", error?.message);
      } else {
        setShoppingCart(data[0])
      }
    }
  }

  async function loadProducts() {
    const { data, error } = await supabaseClient
      .from('prodotto')
      .select(`
        id_prodotto,
        categoria,
        nome,
        prezzo,
        disponibilità (
          url,
          quantità
        )
        `)

    if (error) {
      console.log("Errore nel caricamento dei prodotti", error?.message);
    } else {
      setProducts(data)
    }
  }

  async function getFisrtRandomUserUser() {
    const { data, error } = await supabaseClient
      .from('account')
      .select('*');

    if (error || !data.length) {
      console.log("Errore nel caricamento dell'utente", error?.message);
      return null;
    } else {
      const randomUser = data[Math.floor(Math.random() * data.length)];
      setUser(randomUser);
      return randomUser;
    }
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{
        user,
        setUser
      }}>
        <ShoppingCartContext.Provider value={{
          shoppingCart,
          setShoppingCart
        }}>
          <NavBar />
          <ShoppingCartMenu />
        </ShoppingCartContext.Provider>
      </UserContext.Provider>
      <Routes>
        <Route path='/' element={<div className='products-list'>
          {products.map(prod => {
            return <ProductCard key={prod.id_prodotto} name={prod.nome} price={prod.prezzo} url={prod.disponibilità[0].url} stock={prod.disponibilità[0].quantità}/>
          })}
        </div>
        }></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
