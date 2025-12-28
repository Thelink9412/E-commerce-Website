import { useState, useEffect, useContext } from "react"
import cartIcon from "../assets/cartIcon.png"
import { ShoppingCartContext } from "../App";
import { UserContext } from "../App";

function ShoppingCartMenu() {
    const [active, setActive] = useState(false)
    const [isCartValid, setIsCartValid] = useState(false);
    const { shoppingCart } = useContext(ShoppingCartContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setIsCartValid(shoppingCart.dettagli_del_carrello?.length && shoppingCart.prezzo_totale <= user.saldo)
    }, [shoppingCart])

    return (<>
        <div className={`blur ${active ? 'is-active' : ''}`} onClick={() => setActive(prev => !prev)}></div>
        <div className={`cart-menu ${active ? 'active' : ''}`}>
            <header className='menu-header'>
                <img src={cartIcon} alt="Cart" onClick={() => setActive(prev => !prev)} />
                <span>{user.nome_utente}'s Shopping Cart</span>
            </header>
            <div className='cart-body' style={{ opacity: `${active ? '1' : '0'}` }}>
                <div className='cart-products-container'>
                    {!shoppingCart.dettagli_del_carrello?.length ?
                        (<span style={{
                            color: 'rgba(105, 105, 105, 1)',
                            textShadow: '1px 1px 10px black'
                        }}>Shopping Cart is empty</span>)
                        :
                        (shoppingCart.dettagli_del_carrello.map(prod => {
                            return (<section key={prod.prodotto.nome} className='product-details-from-cart'>
                                <b style={{
                                    color: 'red',

                                }}>{prod.prodotto.nome}</b>
                                <span>Quantity: {prod.quantità}</span>
                                <span>Price: <i>${prod.prezzo_parziale}</i></span>
                                <button className='delete-product-from-cart-btn'>Remove</button>
                            </section>)
                        }))}
                </div>
                <span className='total-price-cart'>Total: <i>${shoppingCart.prezzo_totale}</i></span>
                <button className={`shopping-cart-payment-btn ${isCartValid ? 'valid' : 'invalid'}`}>Buy</button>
            </div>
        </div>
    </>)

}

export default ShoppingCartMenu