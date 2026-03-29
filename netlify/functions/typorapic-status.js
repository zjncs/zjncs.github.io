'use strict'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json; charset=utf-8'
}

const ghFetch = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'typorapic-status-check'
    }
  })

  const body = await response.json().catch(() => ({}))
  return { response, body }
}

exports.handler = async () => {
  const token = process.env.TYPORAPIC_TOKEN || process.env.GITHUB_TOKEN
  const owner = process.env.TYPORAPIC_OWNER || 'zjncs'
  const repo = process.env.TYPORAPIC_REPO || 'TyporaPic'
  const branch = process.env.TYPORAPIC_BRANCH || 'main'
  const status = {
    ok: true,
    tokenConfigured: Boolean(token),
    tokenSource: process.env.TYPORAPIC_TOKEN ? 'TYPORAPIC_TOKEN' : (process.env.GITHUB_TOKEN ? 'GITHUB_TOKEN' : null),
    owner,
    repo,
    branch
  }

  if (!token) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(status)
    }
  }

  try {
    const repoCheck = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, token)
    status.repoAccessible = repoCheck.response.ok
    status.repoStatus = repoCheck.response.status
    status.repoMessage = repoCheck.body?.message || null
    status.permissions = repoCheck.body?.permissions || null

    const branchCheck = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, token)
    status.branchAccessible = branchCheck.response.ok
    status.branchStatus = branchCheck.response.status
    status.branchMessage = branchCheck.body?.message || null
  } catch (error) {
    status.ok = false
    status.githubError = String(error?.message || error)
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(status)
  }
}
