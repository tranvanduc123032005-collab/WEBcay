import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'

export async function GET() {
  try {
    await dbConnect()
    const orders = await Order.find({}).sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()

    const newOrder = await Order.create({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      customerEmail: body.customerEmail || '',
      items: body.items,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod,
      note: body.note || ''
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { id, status } = body

    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true })
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
