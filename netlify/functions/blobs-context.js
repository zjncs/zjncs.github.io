'use strict'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8'
}

const json = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body)
})

const buildSiteOrigin = event => {
  if (process.env.URL) return process.env.URL.replace(/\/$/, '')

  const proto = event.headers['x-forwarded-proto'] || 'https'
  const host = event.headers.host
  return `${proto}://${host}`
}

const verifyIdentity = async event => {
  const auth = event.headers.authorization || event.headers.Authorization
  if (!auth) return false

  const siteOrigin = buildSiteOrigin(event)
  const response = await fetch(`${siteOrigin}/.netlify/identity/user`, {
    headers: { Authorization: auth }
  })

  return response.ok
}

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' })
  }

  if (!(await verifyIdentity(event))) {
    return json(401, { error: '登录状态已失效，请刷新后台后重新登录。' })
  }

  const raw = String(event.blobs || '').trim()
  if (!raw) {
    return json(500, { error: '当前请求没有携带 Netlify Blobs 上下文。' })
  }

  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf8')
    const data = JSON.parse(decoded)
    const siteID = event.headers['x-nf-site-id'] || event.headers['X-Nf-Site-Id']
    const deployID = event.headers['x-nf-deploy-id'] || event.headers['X-Nf-Deploy-Id']

    if (!siteID || !data?.token || !data?.url) {
      return json(500, { error: 'Netlify Blobs 上下文不完整。' })
    }

    return json(200, {
      ok: true,
      context: {
        deployID,
        edgeURL: data.url,
        siteID,
        token: data.token
      }
    })
  } catch (error) {
    return json(500, { error: `解析 Netlify Blobs 上下文失败：${String(error?.message || error)}` })
  }
}
