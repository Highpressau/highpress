import { postType } from './postType'
import { authorType } from './authorType'
import { categoryType } from './categoryType'
import { blockContentType } from './blockContentType'
import { socialFeedType } from './socialFeed'
import { siteSettingsType } from './siteSettings'

export const schemaTypes = [
  postType,
  authorType,
  categoryType,
  blockContentType,
  socialFeedType,
  siteSettingsType,
]

export const schema = {
  types: schemaTypes,
}