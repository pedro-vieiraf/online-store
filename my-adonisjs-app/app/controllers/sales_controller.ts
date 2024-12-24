import Customer from '#models/customer'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class SalesController {
  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    // create a new sale
    const { customerId, productId, quantity } = request.body()

    if (!customerId || !productId || !quantity) {
      return response.status(400).json({ error: 'All fields are required' })
    }

    const customer = await Customer.find(customerId)
    if (!customer) {
      return response.status(404).json({ error: 'Customer not found' })
    }

    const product = await Product.find(productId)
    if (!product) {
      return response.status(404).json({ error: 'Product not found' })
    }

    if (product.stock === 0) {
      return response.status(400).json({ error: 'Product out of stock' })
    }
    if (product.stock < quantity) {
      return response
        .status(400)
        .json({ error: `Not enough items in Stock. Current stock: ${product.stock}` })
    }

    product.stock -= quantity
    await product.save()

    await customer.related('sales').create({
      productId: productId,
      customerId: customerId,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
    })
  }
}
