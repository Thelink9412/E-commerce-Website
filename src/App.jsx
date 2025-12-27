import { useEffect, useState, useRef, createContext } from "react";
import NavBar from "./components/NavBar";
import { createClient } from '@supabase/supabase-js'
import { BrowserRouter } from "react-router-dom";
import ShoppingCartMenu from "./components/ShoppingCartMenu";

const supabaseUrl = 'https://ikqlvnaqasirwjhgrxbd.supabase.co'
const supabaseKey = 'sb_publishable_QKUgd_7ebOKUCsnXlc_wwA_m09ekffz'
const supabaseClient = createClient(supabaseUrl, supabaseKey)
export const ShoppingCartContext = createContext({})
export const UserContext = createContext({})

function App() {
  const [user, setUser] = useState({});
  const [shoppingCart, setShoppingCart] = useState({})
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeUserSettings();
    }
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
          <NavBar/>
          <ShoppingCartMenu />
        </ShoppingCartContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App
