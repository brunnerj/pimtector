import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Logo from './Logo';

const Footer = ({ panel }) => {

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
		panel !== 'gauges' &&
		<footer>
			<p className='copyright'>
				<a target='_blank' rel='noopener noreferrer' href={data.site.siteMetadata.ownerLink}>&copy;
					{data.site.siteMetadata.owner}
				</a>
			
				<Logo className='logo' color='#28ac70' />
			</p>
		</footer>
	);
}

export default Footer;
