import type { AfterChangeHook } from 'payload/dist/collections/config/types'

import type { Order } from '../../../payload-types'

export const updateProductQuantity: AfterChangeHook<Order> = async ({ doc, req, operation }) => {
  if (operation === 'create' || operation === 'update') {
    for (const item of doc.items) {
      const productId = typeof item.product === 'string' ? item.product : item.product.id
      const orderedQuantity = item.quantity

      // Fetch the current product to check its totalQuantity
      const product = await req.payload.findByID({
        collection: 'products',
        id: productId,
      })

      if (product) {
        // Calculate the new total quantity, ensuring it doesn't go negative
        let newTotalQuantity = product.totalQuantity - orderedQuantity
        if (newTotalQuantity < 0) {
          console.error(`Negative stock level detected for product ${productId}.`)
          continue
        }

        // Update the product's totalQuantity
        await req.payload.update({
          collection: 'products',
          id: productId,
          data: {
            totalQuantity: newTotalQuantity,
          },
        })
      } else {
        console.error('Product not found for ID:', productId)
      }
    }
  }
}
