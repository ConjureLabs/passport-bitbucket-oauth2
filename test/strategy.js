const { test } = require('ava')
const BitBucketStrategy = require('../lib/passport-bitbucket/strategy')

// generate a new BitBucketStrategy instance for each pass
test.beforeEach(t => {
  t.context.strategy = new BitBucketStrategy({
    clientID: 'ABC123',
    clientSecret: 'secret'
  }, () => {})
})

test('should be named bitbucket', t => {
  t.is(t.context.strategy.name, 'bitbucket')
})

test.cb('should load user profile', t => {
  const now = new Date()

  // hijack oauth get method, force test response
  t.context.strategy._oauth2.get = (url, token, callback) => {
    const body = `{
      "uuid": "id123",
      "username": "timomars",
      "display_name": "Tim Marshall",
      "website": "https://conjure.sh",
      "created_on": "${now.toString()}",
      "links": {
        "html": {
          "href": "https://conjure.sh",
          "name": "Conjure"
        }
      }
    }`

    callback(null, body, undefined)
  }

  t.context.strategy.userProfile('token', (err, profile) => {
    t.falsy(err)
    t.is(profile.provider, 'bitbucket')
    t.is(profile.username, 'timomars')
    t.is(profile.displayName, 'Tim Marshall')
    t.is(profile.website, 'https://conjure.sh')
    t.is(profile.createdOn.toString(), now.toString()) // using .toString() since precision may be lost due to casting
    t.is(typeof profile._raw, 'string')
    t.is(profile._json.constructor, Object)
    t.end()
  })
})

test.cb('should deal with errors properly', t => {
  // hijack oauth get method, force test response
  t.context.strategy._oauth2.get = (url, token, callback) => {
    callback(new Error('something went wrong'));
  }

  t.context.strategy.userProfile('token', (err, profile) => {
    t.truthy(err)
    t.is(err.constructor.name, 'InternalOAuthError')
    t.falsy(profile)
    t.end()
  })
})
