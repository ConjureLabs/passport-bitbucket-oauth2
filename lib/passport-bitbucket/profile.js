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

  return profile
}
