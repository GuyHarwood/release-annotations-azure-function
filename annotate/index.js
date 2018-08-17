'use strict'

const request = require('request')

module.exports = function (context, req) {
  const buildId = req.body.buildId
  const appId = process.env.APPINSIGHTS_APPID
  const apiKey = process.env.APPINSIGHTS_APIKEY

  const releaseProperties = {
    BuildId: buildId
  }

  context.log(`Creating a new release annotation: ${buildId}`)

  const body = {
    Id: buildId,
    AnnotationName: `Release ${buildId}`,
    EventTime: (new Date()).toISOString(),
    Category: 'Deployment',
    // the Properties part contains a JSON object as a string
    Properties: JSON.stringify(releaseProperties)
  }
  const options = {
    url: `https://aigs1.aisvc.visualstudio.com/applications/${appId}/Annotations?api-version=2015-11`,
    method: 'PUT',
    headers: {
      'X-AIAPIKEY': apiKey
    },
    body: body,
    json: true
  }
  context.log(`Sending request to: ${options.url}`)
  context.log(JSON.stringify(body))

  request(options, function (error, response, body) {
    if (error) {
      context.log(error)
      context.res = {
        status: 500,
        body: error
      }
      context.done()
    } else {
      context.log('Response: ' + response.statusCode + ' - ' + JSON.stringify(body))
      context.res = {
        status: response.statusCode,
        body: body
      }
      context.done()
    }
  })
}
