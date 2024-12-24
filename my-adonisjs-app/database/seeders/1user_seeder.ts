import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany(
      ['email', 'password'],
      [
        {
          email: 'teste1@mail.com',
          password: '123123123',
        },
        {
          email: 'teste2@mail.com',
          password: 'senhateste2',
        },
        {
          email: 'teste3@mail.com',
          password: 'senhateste3',
        },
        {
          email: 'teste4@mail.com',
          password: 'senhateste4',
        },
      ]
    )
  }
}
