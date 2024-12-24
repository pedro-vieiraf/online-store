import { DateTime } from 'luxon'
import Phone from './phone.js'
import Address from './address.js'
import Sale from './sale.js'

import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Product from './product.js'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare cpf: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasOne(() => Phone)
  declare phone: HasOne<typeof Phone>

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>

  @hasOne(() => Address)
  declare address: HasOne<typeof Address>

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>
}
