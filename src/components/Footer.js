import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import Logo from './Logo';

const Footer = ({ show, theme }) => {

	const siteInfo = useStaticQuery(
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

	if (!show) return null;
	
	return (
		<footer className={'theme-' + theme}>
			<p className='copyright'>
				<a target='_blank' rel='noopener noreferrer' href={siteInfo.site.siteMetadata.ownerLink}>&copy;
					{siteInfo.site.siteMetadata.owner}
				</a>
			
				<Logo className='logo' color='#10069F' />
			</p>
		</footer>
	);
}

export default Footer;

Footer.propTypes = {
	show: PropTypes.bool,
	theme: PropTypes.string
}