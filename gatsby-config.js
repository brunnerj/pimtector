/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

const targetAddress = new URL(process.env.TARGET_ADDRESS || `http://pimtector.local`);

module.exports = {
	plugins: [
		{
			resolve: 'gatsby-plugin-s3',
			options: {
				bucketName: process.env.TARGET_BUCKET_NAME || 'fake-bucket',
				region: process.env.AWS_REGION,
				protocol: targetAddress.protocol.slice(0, -1),
				hostname: targetAddress.hostname,
				acl: null,
				params: {
					// add custom content types here see:
					// https://github.com/jariz/gatsby-plugin-s3/blob/master/recipes/custom-content-type.md
				}
			}
		},
		{
			resolve: 'gatsby-plugin-canonical-urls',
			options: {
				siteUrl: targetAddress.href.slice(0, -1)
			}
		}
	]
}
