import Customer from '#models/customer'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Customer.updateOrCreateMany(
      ['userId', 'name', 'cpf'],
      [
        {
          userId: 1,
          name: 'John Doe',
          cpf: 12345678910,
        },
        {
          userId: 2,
          name: 'Jane Doe',
          cpf: 10987654321,
        },
        {
          userId: 3,
          name: 'Foo Bar',
          cpf: 12312312312,
        },
        {
          userId: 4,
          name: 'Baz Qux',
          cpf: 32132132132,
        },
      ]
    )
  }
}
