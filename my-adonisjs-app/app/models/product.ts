import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Sale from './sale.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare stock: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>
}
