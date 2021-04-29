import logger from '../../logger';
import WpPage from '../wp-page';

export default class WordAdsRenderedBlock extends WpPage {
	constructor( page ) {
		super( page, { expectedSelectors: [ ".entry-content iframe[src*='wordads']" ] } );
	}

	async isContentRendered() {
		logger.step( 'Checking Ad rendered block content' );
		// todo check block content here
		return true;
	}
}
