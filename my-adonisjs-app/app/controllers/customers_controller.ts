import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import Sale from '#models/sale'
import Product from '#models/product'

export default class CustomersController {
  async index({ response }: HttpContext) {
    // return all customers
    try {
      const customers = await Customer.query().select('name', 'cpf').orderBy('id', 'asc')

      return response.status(200).json(customers)
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  async store({ request, response }: HttpContext) {
    // create a new customer
    try {
      const { name, userId, cpf } = request.body()
      if (!name || !cpf || !userId) {
        return response.status(400).json({ error: 'All the fields are required' })
      }

      await Customer.create({ name, userId, cpf })

      return response.status(201)
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return response.status(400).json({ error: 'CPF already registered' })
      }
      return response.status(500).json({ error: err.message })
    }
  }

  async show({ params, request, response }: HttpContext) {
    // returns one customer and their sales
    try {
      const { id } = params
      const month = request.input('month')
      const year = request.input('year')

      const customer = await Customer.find(id)
      if (!customer) {
        return response.status(404).json({ error: 'Customer not found' })
      }

      // get all sales for this customer
      const salesQuery = Sale.query()
        .where('customer_id', id)
        .preload('product')
        .orderBy('created_at', 'desc')

      // get all products for this customer
      const productsQuery = Product.query()
        .where('customer_id', id)
        .whereNull('deletedAt')
        .orderBy('created_at', 'desc')

      // filtering by month and/or year
      if (month && year) {
        salesQuery.whereRaw('MONTH(created_at) = ? AND YEAR(created_at) = ?', [month, year])
      } else if (month) {
        salesQuery.whereRaw('MONTH(created_at) = ?', [month])
      } else if (year) {
        salesQuery.whereRaw('YEAR(created_at) = ?', [year])
      }

      // get the sales
      const sales = await salesQuery

      // format the sales data
      const filteredSales = sales.map((sale) => {
        return {
          id: sale.id,
          product: {
            name: sale.product.name,
            description: sale.product.description,
            price: sale.product.price,
            quantity: sale.quantity,
            finalPrice: sale.quantity * sale.unitPrice,
          },
        }
      })

      // get the products
      const products = await productsQuery

      // format the products data
      const filteredProducts = products.map((product) => {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
        }
      })

      return response.status(200).json({
        customer: {
          id: customer.id,
          name: customer.name,
          cpf: customer.cpf,
        },
        sales: filteredSales,
        products: filteredProducts,
      })
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  async update({ params, response, request }: HttpContext) {
    // update a customer
    try {
      const { id } = params
      const { name, cpf } = request.body()

      const customer = await Customer.find(id) // find the customer

      if (!customer) {
        return response.status(404).json({ error: 'Customer not found' })
      }
      const newCustomer = {
        name: name,
        cpf: cpf,
      }

      await customer.merge(newCustomer).save() // update the customer

      return response.status(200).json(newCustomer)
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    // delete a customer
    try {
      const { id } = params

      const customer = await Customer.find(id) // find the customer

      if (!customer) {
        return response.status(404).json({ error: 'Customer not found' })
      }

      await customer.delete() // delete the customer

      return response.status(204)
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }
}
