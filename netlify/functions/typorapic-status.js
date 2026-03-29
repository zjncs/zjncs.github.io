'use strict'

const crypto = require('node:crypto')
const { getStore, setEnvironmentContext } = require('@netlify/blobs')

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json; charset=utf-8'
}

const STORE_NAME = 'cms-images'

const parseBlobsContext = event => {
  const raw = String(event.blobs || '').trim()
  if (!raw) return null

  const decoded = Buffer.from(raw, 'base64').toString('utf8')
  const data = JSON.parse(decoded)
  const siteID = event.headers['x-nf-site-id'] || event.headers['X-Nf-Site-Id']
  const deployID = event.headers['x-nf-deploy-id'] || event.headers['X-Nf-Deploy-Id']

  if (!siteID || !data?.token || !data?.url) return null

  return {
    deployID,
    edgeURL: data.url,
    siteID,
    token: data.token
  }
}

exports.handler = async event => {
  const status = {
    ok: true,
    storage: 'netlify-blobs',
    store: STORE_NAME
  }

  try {
    const context = parseBlobsContext(event)
    if (!context) {
      throw new Error('Netlify Blobs 上下文缺失。')
    }

    setEnvironmentContext(context)
    const store = getStore(STORE_NAME)
    const key = `_health/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.txt`
    const value = `ok:${new Date().toISOString()}`

    await store.set(key, value, {
      metadata: {
        contentType: 'text/plain; charset=utf-8'
      }
    })

    const blob = await store.getWithMetadata(key, { type: 'text' })
    await store.delete(key)

    status.write = true
    status.read = blob?.data === value
    status.metadata = blob?.metadata || null
  } catch (error) {
    status.ok = false
    status.write = false
    status.read = false
    status.error = String(error?.message || error)
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(status)
  }
}
