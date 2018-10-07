/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = json => {
  if (typeof json === 'string') {
    json = JSON.parse(json)
  }
  
  const profile = {}
  profile.id = json.uuid
  profile.displayName = json.display_name
  profile.username = json.username
  profile.profileUrl = json.links.html.href
  profile.website = json.website
  profile.createdOn = new Date(json.created_on)
  profile.createdOn = Number.isNaN(profile.createdOn) ? null : profile.createdOn

  return profile
}
