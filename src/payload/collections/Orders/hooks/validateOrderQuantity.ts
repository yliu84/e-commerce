import type { BeforeChangeHook } from 'payload/dist/collections/config/types'

export const validateOrderQuantity: BeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create' || operation === 'update') {
    const itemId = data.id // The ID of the item being ordered
    const orderedQuantity = data.quantity // The quantity being ordered

    // Fetch the item to check its totalQuantity
    const item = await req.payload.findByID({
      collection: 'products',
      id: itemId,
    })

    if (!item || orderedQuantity > item.totalQuantity) {
      throw new Error('Ordered quantity exceeds available stock.')
    }
  }

  return
}
