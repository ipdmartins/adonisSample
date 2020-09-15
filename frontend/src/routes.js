import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Product from './components/Products';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' component={Product} />
            </Switch>
        </BrowserRouter>
    );
}