import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Footer = () => {

	const data = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						owner
						ownerLink
					}
				}
			}
		`
	);

	return (
		<footer>
			<p className='copyright'>
				&copy;
				<a target='_blank' rel='noopener noreferrer' href={data.site.siteMetadata.ownerLink}>{data.site.siteMetadata.owner}</a>
			</p>
		</footer>
	);
}

export default Footer;
