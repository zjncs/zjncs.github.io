'use strict'

const { getStore, setEnvironmentContext } = require('@netlify/blobs')

const STORE_NAME = 'cms-images'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS'
}

const withCacheHeaders = extra => ({
  ...headers,
  'Cache-Control': 'public, max-age=31536000, immutable',
  ...extra
})

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
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const key = decodeURIComponent(String(event.queryStringParameters?.key || '').trim())
  if (!key) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'Missing key' })
    }
  }

  try {
    const context = parseBlobsContext(event)
    if (!context) {
      throw new Error('Netlify Blobs 上下文缺失。')
    }

    setEnvironmentContext(context)
    const store = getStore(STORE_NAME)
    const blob = await store.getWithMetadata(key, { type: 'arrayBuffer' })

    if (!blob || !blob.data) {
      return { statusCode: 404, headers, body: '' }
    }

    const contentType = blob.metadata?.contentType || 'application/octet-stream'
    const body = Buffer.from(blob.data).toString('base64')

    return {
      statusCode: 200,
      headers: withCacheHeaders({
        'Content-Type': contentType
      }),
      body: event.httpMethod === 'HEAD' ? '' : body,
      isBase64Encoded: event.httpMethod !== 'HEAD'
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        error: `Blob read failed: ${String(error?.message || error)}`
      })
    }
  }
}
