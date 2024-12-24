/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// fazer um index, ou algo assim

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')
const SalesController = () => import('#controllers/sales_controller')
const CustomersController = () => import('#controllers/customers_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// login route
router.group(() => {
  router.post('register', [AuthController, 'register']).as('auth.register')
  router.post('login', [AuthController, 'login']).as('auth.login')
  router
    .delete('logout', [AuthController, 'logout'])
    .as('auth.logout')
    .as('auth.logout')
    .use(middleware.auth())
  router.get('me', [AuthController, 'me']).as('auth.me')
})

// customers routes
router
  .group(() => {
    router.get('customers', [CustomersController, 'index'])
    router.get('customers/:id', [CustomersController, 'show'])
    router.post('customers', [CustomersController, 'store'])
    router.put('customers/:id', [CustomersController, 'update'])
    router.delete('customers/:id', [CustomersController, 'destroy'])
  })
  .use(middleware.auth())

// products routes
router
  .group(() => {
    router.get('products', [ProductsController, 'index'])
    router.get('products/:id', [ProductsController, 'show'])
    router.post('products', [ProductsController, 'store'])
    router.put('products/:id', [ProductsController, 'update'])
    router.delete('products/:id', [ProductsController, 'destroy'])
  })
  .use(middleware.auth())

// sales routes
router
  .group(() => {
    router.post('sales', [SalesController, 'store'])
  })
  .use(middleware.auth())
