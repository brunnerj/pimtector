# PIMtector Web Site

Static web site based on [Gatsby.js](https://www.gatsbyjs.org/)
and the [gatsby-starter-dimension](https://github.com/codebushi/gatsby-starter-dimension)
template.


## Development and Preview

Changes pushed to the master branch of this repository will be automatically built
using an AWS CodePipeline into a preview that must be manually accepted
before it will be published to the live site https://pimtector.com.

The AWS CI/CD process follows guidelines presented in
[this](https://blog.joshwalsh.me/aws-gatsby/) article.

*Viewing the preview requires authorization credentials*

https://preview.pimtector.com


## Local Testing

To get an experience closer to production, 
use `sudo gatsby serve --host pimtector.local --port 80` instead of
the typical `gatsby develop`. Note that the local `hosts` file has an entry
to point `localhost` to this address.


## Installation

As with most Node-based programs, just clone the repository locally, switch
to the cloned project directory and `npm install`.  Then follow the local
testing guidelines above. `gatsby develop` still works for a quick check
of the site operation (browse instead to `http://localhost:8000`).