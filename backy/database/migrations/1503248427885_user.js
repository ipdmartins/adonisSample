'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('cpf', 14).notNullable()
      table.string('street', 60).notNullable()
      table.integer('number', 6).notNullable()
      table.string('district', 60).notNullable()
      table.string('city', 60).notNullable()
      table.string('zip', 15).notNullable()
      table.string('state', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
