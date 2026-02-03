import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Valid email is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'subscribers' as any,
      where: {
        email: { equals: email },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0] as any
      if (subscriber.status === 'active') {
        return NextResponse.json({ message: 'Already subscribed.' }, { status: 409 })
      }
      // Re-activate if unsubscribed
      await payload.update({
        collection: 'subscribers' as any,
        id: subscriber.id,
        data: { status: 'active' } as any,
      })
      return NextResponse.json({ message: 'Welcome back.' })
    }

    await payload.create({
      collection: 'subscribers' as any,
      data: {
        email,
        status: 'active',
        source: 'blog',
      } as any,
    })

    return NextResponse.json({ message: 'Subscribed.' })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 })
  }
}
