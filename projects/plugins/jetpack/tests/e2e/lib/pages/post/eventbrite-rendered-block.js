import logger from '../../logger';
import WpPage from '../wp-page';

export default class EventbriteRenderedBlock extends WpPage {
	constructor( page ) {
		super( page, { expectedSelectors: [ '.wp-block-jetpack-eventbrite iframe' ] } );
	}

	async isContentRendered( eventId ) {
		logger.step( 'Checking Eventbrite rendered block content' );
		return this.isElementVisible( `iframe[data-automation='checkout-widget-iframe-${ eventId }']` );
	}
}
