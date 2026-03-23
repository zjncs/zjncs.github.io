'use strict'

hexo.extend.filter.register('before_post_render', data => {
  if (data.layout !== 'post' || data.top_img === false || data.top_img) return data

  const defaultTopImg = hexo.theme.config.default_top_img
  if (defaultTopImg) data.top_img = defaultTopImg

  return data
})
