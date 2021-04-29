import logger from '../../logger';
import WpPage from '../wp-page';

export default class MailchimpRenderedBlock extends WpPage {
	constructor( page ) {
		const containerSelector = '.wp-block-jetpack-mailchimp';
		const emailSelector = `${ containerSelector }  input[type='email']`;
		const submitSelector = `${ containerSelector } button[type='submit']`;
		const consentSelector = `${ containerSelector } #wp-block-jetpack-mailchimp_consent-text`;
		super( page, { expectedSelectors: [ emailSelector, submitSelector, consentSelector ] } );
	}

	async isContentRendered() {
		logger.step( 'Checking Mailchimp rendered block content' );
		// todo check block content here
		return true;
	}
}
