import logger from '../../logger';
import WpPage from '../wp-page';

export default class PayPalRenderedBlock extends WpPage {
	constructor( page ) {
		super( page, { expectedSelectors: [ '.jetpack-simple-payments-product' ] } );
	}

	async isContentRendered() {
		logger.step( 'Checking PayPal rendered block content' );
		// todo check block content here
		return true;
	}
}
