const { test } = require('ava')
const strategy = require('../lib/passport-bitbucket/strategy')

// generate a new BitBucketStrategy instance for each pass
test.beforeEach(t => {
  t.context.strategy = new BitBucketStrategy({
    consumerKey: 'ABC123',
    consumerSecret: 'secret'
  }, () => {})
})

test('should be named bitbucket', t => {
  t.is(t.context.strategy.name, 'bitbucket')
})

test.cb('should load user profile', t => {
  // hijack oauth get method, force test response
  t.context.strategy._oauth.get = (url, token, tokenSecret, callback) => {
    const body = `{
      "repositories": [{
        "scm": "git",
        "has_wiki": false,
        "last_updated": "2012-01-09 06:12:36",
        "created_on": "2012-01-09 06:11:25",
        "owner": "jaredhanson",
        "logo": null,
        "email_mailinglist": "",
        "is_mq": false,
        "size": 2515,
        "read_only": false,
        "fork_of": null,
        "mq_of": null,
        "state": "available",
        "utc_created_on": "2012-01-09 05:11:25+00:00",
        "website": "",
        "description": "Secret project.",
        "has_issues": false,
        "is_fork": false,
        "slug": "secret",
        "is_private": true,
        "name": "secret",
        "language": "",
        "utc_last_updated": "2012-01-09 05:12:36+00:00",
        "email_writers": true,
        "main_branch": "master",
        "no_public_forks": false,
        "resource_uri": "/api/1.0/repositories/jaredhanson/secret"
      }, {
        "scm": "git",
        "has_wiki": false,
        "last_updated": "2012-01-12 08:46:02",
        "created_on": "2011-12-15 01:03:27",
        "owner": "jaredhanson",
        "logo": null,
        "email_mailinglist": "",
        "is_mq": false,
        "size": 99600,
        "read_only": false,
        "fork_of": null,
        "mq_of": null,
        "state": "available",
        "utc_created_on": "2011-12-15 00:03:27+00:00",
        "website": "",
        "description": "Super secret project.",
        "has_issues": false,
        "is_fork": false,
        "slug": "super-secret",
        "is_private": true,
        "name": "super-secret",
        "language": "",
        "utc_last_updated": "2012-01-12 07:46:02+00:00",
        "email_writers": true,
        "main_branch": "master",
        "no_public_forks": false,
        "resource_uri": "/api/1.0/repositories/jaredhanson/super-secret"
      }],
      "user": {
        "username": "jaredhanson",
        "first_name": "Jared",
        "last_name": "Hanson",
        "avatar": "https://secure.gravatar.com/avatar/6c43616eef331e8ad08c7f90a51069a5?d=identicon&s=32",
        "resource_uri": "/1.0/users/jaredhanson"
      }
    }`

    callback(null, body, undefined)
  }

  t.context.strategy.userProfile('token', 'token-secret', {}, (err, profile) => {
    t.falsy(err)
    t.is(profile.provider, 'bitbucket')
    t.is(profile.username, 'jaredhanson')
    t.is(profile.displayName, 'Jared Hanson')
    t.is(profile.name.familyName, 'Hanson')
    t.is(profile.name.givenName, 'Jared')
    t.is(typeof profile._raw, 'string')
    t.is(profile._json.constructor, Object)
    t.end()
  })
})

test.cb('should deal with errors properly', t => {
  // hijack oauth get method, force test response
  t.context.strategy._oauth.get = (url, token, tokenSecret, callback) => {
    callback(new Error('something went wrong'));
  }

  t.context.strategy.userProfile('token', 'token-secret', {}, (err, profile) => {
    t.truthy(err)
    t.is(err.constructor.name, 'InternalOAuthError')
    t.falsy(profile)
    t.done()
  })
})
