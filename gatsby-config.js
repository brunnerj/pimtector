/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

const targetAddress = new URL(process.env.TARGET_ADDRESS || `http://pimtector.local`);

module.exports = {
	siteMetadata: {
		title: 'PIMtector',
		author: 'James Brunner',
		description: 'PIMtector to hunt down PIM',
		keywords: 'PIM, passive IM, PIM testing, intermodulation, PIM hunting, interference hunting',
		owner: 'Brunner Technical Services LLC',
		ownerLink: 'https://brunnertechnicalservices.com'
	},
	plugins: [
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				name: 'PIMtector',
				short_name: 'PIMtector',
				start_url: '/',
				background_color: '#663399',
				theme_color: '#28ac70',
				display: 'standalone',
				icon: 'src/images/icon.png', // This path is relative to the root of the site.
			},
		},
		'gatsby-plugin-sass',
		'gatsby-plugin-react-helmet',
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
