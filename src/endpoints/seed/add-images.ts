/**
 * Script to upload 6 images and insert them into the "Pingu on Monad: But Why?" article.
 * Run via: TOKEN=xxx node --loader ts-node/esm src/endpoints/seed/add-images.ts
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const BASE = 'http://localhost:3000'
const IMG_DIR =
  '/Users/davidfaymanzo/Desktop/Claude/Pingu-Intelligence/assets/visuals/article-why-pingu/PNG @x2 article-why-pingu-figma'

// Images in order of insertion into the article
const IMAGES = [
  { file: 'Frame 2147223236.png', alt: 'Oracle-based vs Orderbook pricing comparison' },
  { file: 'Frame 2147223230.png', alt: 'Vault model and Stability Fund diagram' },
  { file: 'Frame 2147223232.png', alt: 'Execution flow comparison - CLOB vs Pingu' },
  { file: 'Frame 2147223233.png', alt: 'Architecture comparison table' },
  { file: 'Frame 2147223234.png', alt: 'Infrastructure comparison - Monad vs others' },
  { file: 'Frame 2147223235.png', alt: 'The Pingu Stack - layered architecture' },
]

async function getToken(): Promise<string> {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo-author@example.com', password: 'password' }),
  })
  const data = await res.json()
  return data.token
}

async function uploadImage(
  token: string,
  filename: string,
  alt: string,
): Promise<number> {
  const filePath = path.join(IMG_DIR, filename)
  const fileBuffer = fs.readFileSync(filePath)
  const formData = new FormData()
  formData.append('file', new Blob([fileBuffer], { type: 'image/png' }), filename)
  formData.append('_payload', JSON.stringify({ alt }))

  const res = await fetch(`${BASE}/api/media`, {
    method: 'POST',
    headers: { Cookie: `payload-token=${token}` },
    body: formData,
  })
  const data = await res.json()
  if (!data.doc) {
    console.error(`Upload failed for ${filename}:`, JSON.stringify(data).substring(0, 300))
    throw new Error(`Upload failed for ${filename}`)
  }
  console.log(`Uploaded ${filename} -> id=${data.doc.id}`)
  return data.doc.id
}

function makeMediaBlock(mediaId: number) {
  return {
    type: 'block' as const,
    fields: {
      blockName: '',
      blockType: 'mediaBlock',
      media: mediaId,
    },
    format: '' as const,
    version: 2,
  }
}

async function main() {
  const token = await getToken()
  console.log('Logged in.')

  // Upload all images
  const mediaIds: number[] = []
  for (const img of IMAGES) {
    const id = await uploadImage(token, img.file, img.alt)
    mediaIds.push(id)
  }

  // Get the post
  const postsRes = await fetch(
    `${BASE}/api/posts?where[slug][equals]=pingu-on-monad-but-why&depth=0`,
    { headers: { Cookie: `payload-token=${token}` } },
  )
  const postsData = await postsRes.json()
  const post = postsData.docs[0]
  if (!post) {
    console.error('Post not found!')
    process.exit(1)
  }
  console.log(`Found post: ${post.title} (id=${post.id})`)

  // Get current content children
  const children = post.content.root.children as any[]

  // Map: insert image AFTER specific content nodes
  // The article structure (by index in children array):
  // 0: h2 "The Pricing Model Question"
  // 1: p "Every perp DEX..."
  // 2: p "Orderbook-based pricing..."
  // 3: p "Oracle-based pricing..."
  // 4: p "Different model..."
  // 5: hr
  // -- INSERT Image 0 (Frame 2147223236 - pricing comparison) at index 4 (after "Different model")
  //
  // 6: h2 "The Vault Model"
  // 7: p "Pingu has no orderbook..."
  // 8: p "LPs deposit into..."
  // -- INSERT Image 1 (Frame 2147223230 - vault diagram) at index 8 (after vault intro)
  //
  // 9: h3 "The Stability Fund"
  // ...
  // 12: h3 "Risk Parameters"
  // 13: p risk params...
  // 14: hr
  //
  // 15: h2 "Oracle-Based Execution"
  // 16: h3 "Why Your Orders..."
  // 17: p "On an orderbook..."
  // 18: p "On Pingu..."
  // -- INSERT Image 2 (Frame 2147223232 - execution flow) at index 18
  //
  // 19: h3 "Pyth: The Price Source"
  // 20: p "Pyth isn't a single feed..."
  // 21: p "Every price..."
  // 22: hr
  //
  // 23: h2 "On-Chain Execution"
  // 24: h3 "What's Actually On-Chain"
  // 25: p "Many DEXs claim..."
  // 26: p "Pingu's critical path..."
  // 27: p "The contracts are audited..."
  // -- INSERT Image 3 (Frame 2147223233 - architecture) at index 26 (after critical path)
  //
  // 28: h3 "Non-Custodial"
  // 29: p "Connect wallet..."
  // 30: hr
  //
  // 31: h2 "Why Monad"
  // 32: h3 "The Infrastructure Problem"
  // 33: p "Building a performant..."
  // 34: h3 "The Numbers"
  // 35: p "Block time..."
  // -- INSERT Image 4 (Frame 2147223234 - infra comparison) at index 35
  //
  // 36: h3 "The Decentralization Question"
  // ...
  // 39: h3 "Why Finality Matters"
  // 40: p "800ms finality..."
  // 41: hr
  //
  // 42: h2 "The Combination"
  // 43: h3 "Oracle + Monad"
  // 44: p "Pyth updates..."
  // 45: h3 "On-Chain + Monad"
  // 46: p "Full on-chain..."
  // -- INSERT Image 5 (Frame 2147223235 - Pingu stack) at index 46
  //
  // 47: hr
  // ...rest

  // Print current structure for debugging
  console.log('\nCurrent article structure:')
  children.forEach((node: any, i: number) => {
    if (node.type === 'heading') {
      const text = node.children?.[0]?.text || ''
      console.log(`  [${i}] ${node.tag || 'h?'}: "${text}"`)
    } else if (node.type === 'paragraph') {
      const text = node.children?.[0]?.text || ''
      console.log(`  [${i}] p: "${text.substring(0, 50)}..."`)
    } else {
      console.log(`  [${i}] ${node.type}`)
    }
  })

  // Insert images in REVERSE order so indices don't shift
  // We need to find the right positions by looking at content
  const insertions: { afterIndex: number; mediaId: number }[] = []

  // Find each insertion point by scanning content
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (node.type === 'paragraph') {
      const text = node.children?.[0]?.text || ''
      // Image 0: after "Different model. Different tradeoffs..."
      if (text.startsWith('Different model')) {
        insertions.push({ afterIndex: i, mediaId: mediaIds[0] })
      }
      // Image 2: after "On Pingu, the execution price..."
      if (text.startsWith('On Pingu, the execution price')) {
        insertions.push({ afterIndex: i, mediaId: mediaIds[2] })
      }
    }
    if (node.type === 'heading') {
      const text = node.children?.[0]?.text || ''
      // Image 1: before "The Stability Fund" h3 (after vault intro paragraphs)
      if (text === 'The Stability Fund') {
        insertions.push({ afterIndex: i - 1, mediaId: mediaIds[1] })
      }
      // Image 3: before "Non-Custodial" h3
      if (text === 'Non-Custodial') {
        insertions.push({ afterIndex: i - 1, mediaId: mediaIds[3] })
      }
      // Image 4: before "The Decentralization Question" h3
      if (text === 'The Decentralization Question') {
        insertions.push({ afterIndex: i - 1, mediaId: mediaIds[4] })
      }
    }
  }

  // Image 5: before the last hr (before "What This Means For Traders" section)
  // Find h2 "What This Means For Traders" and insert before the hr that precedes it
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (
      node.type === 'heading' &&
      node.children?.[0]?.text === 'What This Means For Traders'
    ) {
      // The hr before this heading
      insertions.push({ afterIndex: i - 1, mediaId: mediaIds[5] })
      break
    }
  }

  console.log('\nInsertion points:')
  insertions.forEach((ins) =>
    console.log(`  After index ${ins.afterIndex} -> mediaId ${ins.mediaId}`),
  )

  // Sort by index descending so we insert from bottom to top
  insertions.sort((a, b) => b.afterIndex - a.afterIndex)

  for (const ins of insertions) {
    children.splice(ins.afterIndex + 1, 0, makeMediaBlock(ins.mediaId))
  }

  console.log(`\nInserted ${insertions.length} images. Updating post...`)

  // Update the post
  const updateRes = await fetch(`${BASE}/api/posts/${post.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `payload-token=${token}`,
    },
    body: JSON.stringify({
      content: { root: { ...post.content.root, children } },
    }),
  })

  const updateData = await updateRes.json()
  if (updateData.doc) {
    console.log('Post updated successfully!')
  } else {
    console.error('Update failed:', JSON.stringify(updateData, null, 2))
  }
}

main().catch(console.error)
