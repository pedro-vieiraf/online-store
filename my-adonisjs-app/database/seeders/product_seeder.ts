import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Product.updateOrCreateMany(
      ['customerId', 'name', 'price', 'stock', 'description'],
      [
        {
          customerId: 1,
          name: 'Triforce',
          price: 9999,
          stock: 1,
          description: 'A sacred golden relic left behind by the Golden Goddesses',
        },
        {
          customerId: 2,
          name: 'Master Sword',
          price: 1500,
          stock: 23,
          description: 'The Sword of the Hero of Time',
        },
        {
          customerId: 1,
          name: 'Ocarina of Time',
          price: 550,
          stock: 30,
          description:
            'A sacred instrument has been secretly passed down for generations within the Royal Family of Hyrule',
        },
      ]
    )
  }
}
