'use strict'

const Product = use('App/Models/Product')

class ProductController {

    async store({ request }) {
        const product = request.only(['name','manufacturer','description']);

        await Product.create(product);

        return (product);
    }

    async index() {
        const products = await Product.all();

        return products;
    }

    async show({ params }) {
        const product = await Product.findOrFail(params.id);

        return (product);
    }

    async update({ request, params }) {
        const product = await Product.findOrFail(params.id);

        const newProduct = request.only(['name','manufacturer','description']);

        product.merge(newProduct);

        await product.save();

        return ('Updated successfully');
    }

    async destroy({ params }) {
        const product = await Product.findOrFail(params.id);

        await product.delete();

        return ('successfully deleted ');
    }

}

module.exports = ProductController
