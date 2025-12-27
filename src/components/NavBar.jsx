import { React, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ShoppingCartMenu from './ShoppingCartMenu';
import { UserContext } from '../App';
function NavBar() {
    const {user} = useContext(UserContext);
    return (<nav className='top-navbar'>
        <h2 className='title'>E-Commerce Database</h2>
        <div className='profile-section'>
            <span className='profile-name'>{user !== null ? user.nome_utente : ''}</span>
            Balance: ${user.saldo}
        </div>
        {/* <ShoppingCartMenu /> */}
    </nav>)
}

export default NavBar