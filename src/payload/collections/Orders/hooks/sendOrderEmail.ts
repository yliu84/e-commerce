import type { AfterChangeHook } from 'payload/dist/collections/config/types'

import type { Order } from '../../../payload-types'

export const sendOrderEmail: AfterChangeHook<Order> = async ({ doc, req, operation }) => {
  const { payload } = req
  const { items, total } = doc
  if (operation === 'create') {
    const orderedBy = typeof doc.orderedBy === 'string' ? doc.orderedBy : doc.orderedBy.id

    const user = await payload.findByID({
      collection: 'users',
      id: orderedBy,
    })

    const allEmails = `yangliu0127@gmail.com, ${user.email}`
    const uniqueEmails = Array.from(new Set(allEmails.split(', ').map(email => email.trim()))).join(
      ', ',
    )

    const convertPrice = (price: number): string => {
      return (price / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    }

    const mailOptions = {
      from: 'yangliu0127@gmail.com',
      to: uniqueEmails,
      subject: 'Order Confirmation',
      templateId: 'd-d914cd8b289540e6b057e2ce4d170b57',
      dynamic_template_data: {
        order_number: doc.id,
        user_name: user.name,
        orderItems: items.map(item => ({
          title: typeof item.product === 'string' ? item.product : item.product.title,
          quantity: item.quantity,
          price: convertPrice(item.price),
          image:
            typeof item.product === 'string'
              ? item.product
              : typeof item.product.meta.image === 'string'
              ? item.product.meta.image
              : item.product.meta.image.url,
        })),
        total: convertPrice(total),
      },
    }

    payload
      .sendEmail(mailOptions)
      .then(() => {
        console.log('the email has been sent out successfully!')
      })
      .catch(error => {
        console.log(error)
      })
  }

  return
}
