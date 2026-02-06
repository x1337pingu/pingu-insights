import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
    }

    // Decode email from base64 token
    let email: string
    try {
      email = Buffer.from(token, 'base64').toString('utf-8')
    } catch {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 400 })
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const existing = await payload.find({
      collection: 'subscribers' as any,
      where: {
        email: { equals: email },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      return NextResponse.json({ message: 'Email not found.' }, { status: 404 })
    }

    const subscriber = existing.docs[0] as any

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({ message: 'Already unsubscribed.' })
    }

    await payload.update({
      collection: 'subscribers' as any,
      id: subscriber.id,
      data: { status: 'unsubscribed' } as any,
    })

    return NextResponse.json({ message: 'Unsubscribed successfully.' })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 })
  }
}
