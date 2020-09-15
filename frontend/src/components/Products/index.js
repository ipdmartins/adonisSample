import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import {
    Table,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';

class FormProduct extends Component {

    state = {
        model: {
            id: 0,
            description: '',
            manufacturer: ''
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {
        this.setState({ model: { id: 0, description: '', manufacturer: '' } })
        this.props.productCreate(this.state.model);
    }

    componentWillMount() {
        PubSub.subscribe('edit-product', (topic, product) => {
            this.setState({ model: product });
        });
    }

    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="description">Descrição:</Label>
                    <Input id="description" type="text" value={this.state.model.description} placeholder="Descrição do Produto..."
                        onChange={e => this.setValues(e, 'description')} />
                </FormGroup>
                <FormGroup>
                    <div className="form-row">
                        <div className="col-md-6">
                            <Label for="manufacturer">Fabricante:</Label>
                            <Input id="manufacturer" type="text" value={this.state.model.manufacturer} placeholder="Nome do Fabricante "
                                onChange={e => this.setValues(e, 'manufacturer')} />
                        </div>

                    </div>
                </FormGroup>
                <Button color="primary" block onClick={this.create}> Gravar </Button>
            </Form>
        );
    }
}

class ListProduct extends Component {

    delete = (id) => {
        this.props.deleteProduct(id);
    }

    onEdit = (product) => {
        PubSub.publish('edit-product', product);
    }

    render() {
        const { products } = this.props;
        return (
            <Table className="table-bordered text-center">
                <thead className="thead-dark">
                    <tr>
                        <th>Descrição</th>
                        <th>Fabricante</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map(product => (
                            <tr key={product.id}>
                                <td>{product.description}</td>
                                <td>{product.manufacturer}</td>

                                <td>
                                    <Button color="info" size="sm" onClick={e => this.onEdit(product)}>Editar</Button>
                                    <Button color="danger" size="sm" onClick={e => this.delete(product.id)}>Deletar</Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        );
    }
}

export default class ProductBox extends Component {

    Url = 'http://localhost:9000/products';

    state = {
        products: [],
        message: {
            text: '',
            alert: ''
        }
    }

    componentDidMount() {
        fetch(this.Url)
            .then(response => response.json())
            .then(products => this.setState({ products }))
            .catch(e => console.log(e));
    }

    save = (product) => {
        let data = {
            id: parseInt(product.id),
            description: product.description,
            manufacturer: parseFloat(product.manufacturer)

        };
        console.log(data);

        const requestInfo = {
            method: data.id !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        if (data.id === 0) {
            // CREATE NEW PRODUCT
            fetch(this.Url, requestInfo)
                .then(response => response.json())
                .then(newProduct => {
                    let { products } = this.state;
                    products.push(newProduct);
                    this.setState({ products, message: { text: 'Novo produto adicionado com sucesso!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            // EDIT PRODUCT
            fetch(`${this.Url}/${data.id}`, requestInfo)
                .then(response => response.json())
                .then(updatedProduct => {
                    let { products } = this.state;
                    let position = products.findIndex(product => product.id === data.id);
                    products[position] = updatedProduct;
                    this.setState({ products, message: { text: 'Produto atualizado com sucesso!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    delete = (id) => {
        fetch(`${this.Url}/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(rows => {
                const products = this.state.products.filter(product => product.id !== id);
                this.setState({ products, message: { text: 'Produto deletado com sucesso.', alert: 'danger' } });
                this.timerMessage(3000);
            })
            .catch(e => console.log(e));
    }

    timerMessage = (duration) => {
        setTimeout(() => {
            this.setState({ message: { text: '', alert: '' } });
        }, duration);
    }

    render() {
        return (
            <div>
                {
                    this.state.message.text !== '' ? (
                        <Alert color={this.state.message.alert} className="text-center"> {this.state.message.text} </Alert>
                    ) : ''
                }

                <div className="row">

                    <div className="col-md-6 my-3">
                        <h2 className="font-weight-bold text-center"> Cadastro de Produtos </h2>
                        <FormProduct productCreate={this.save} />
                    </div>
                    <div className="col-md-6 my-3">
                        <h2 className="font-weight-bold text-center"> Lista de Produtos </h2>
                        <ListProduct products={this.state.products} deleteProduct={this.delete} />
                    </div>
                </div>
            </div>
        );
    }
}