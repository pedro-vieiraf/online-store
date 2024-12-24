import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ProductsController {
  async index({ response }: HttpContext) {
    // return all products
    try {
      const products = await Product.query()
        .select('id', 'name', 'price', 'stock')
        .whereNull('deletedAt')
        .orderBy('created_at', 'asc')

      return response.status(200).json(products)
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  async store({ request, response }: HttpContext) {
    // create new product
    try {
      const { customerId, name, price, stock, description } = request.body()
      if (!customerId || !name || !price || !stock || !description) {
        return response.status(400).json({ error: 'All fields are required' })
      }

      await Product.create({ customerId, name, price, stock, description })

      return response.status(201).json({ message: 'Product created' })
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  async show({ params, response }: HttpContext) {
    // return one product
    try {
      const { id } = params
      const product = await Product.query()
        .where('id', id)
        .select('id', 'name', 'price', 'stock', 'description')
        .first()

      if (!product) {
        return response.status(404).json({ error: 'Product not found' })
      }

      return response.status(200).json(product)
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  async update({ params, request, response }: HttpContext) {
    // update the product
    try {
      const { id } = params
      const data = request.only(['name', 'price', 'stock', 'description'])

      const product = await Product.find(id)
      if (!product) {
        return response.status(404).json({ error: 'Product not found' })
      }

      product.merge(data)
      await product.save()

      return response.status(200).json(product)
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params

      const product = await Product.find(id)
      if (!product) {
        return response.status(404).json({ error: 'Product not found' })
      }

      const newProduct = {
        deletedAt: DateTime.local(),
      }

      await product.merge(newProduct).save()

      return response.status(204).json({ message: 'Product deleted' })
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }
}
