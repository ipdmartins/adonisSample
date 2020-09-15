'use strict'

const Order = use('App/Models/Order')
const Product = use('App/Models/Product')
const User = use('App/Models/User')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index() {

    const orders = await Order.all();

    return orders;

  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request}) {

    const data = request.only([
      'product_id',
      'user_id',
      'quantity',
      'price',
      'discount',
    ]);
   
    var calc = data.quantity * data.price;

    if (data.discount != null) {
      calc = (((100 - data.discount) / 100) * calc);
    }
    
    const order = {
      product_id: data.product_id,
      user_id: data.user_id,
      quantity: data.quantity,
      price: data.price,
      discount: data.discount,
      total: calc
    }
    
    await Order.create(order);

    return (order);
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const order = await Order.findOrFail(params.id);

    return (order);
  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request }) {
    const order = await Order.findOrFail(params.id);

    const newOrder = request.only([
      'product_id',
      'user_id',
      'quantity',
      'price',
      'discount'
    ]);

    order.merge(newOrder);

    await order.save();

    return ('Updated successfully');
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params }) {
    const order = await Order.findOrFail(params.id);

    await order.delete();

    return ('successfully deleted ');
  }
}

module.exports = OrderController
