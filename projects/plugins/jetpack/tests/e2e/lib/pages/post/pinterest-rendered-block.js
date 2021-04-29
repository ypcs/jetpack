import logger from '../../logger';
import WpPage from '../wp-page';

export default class PinterestRenderedBlock extends WpPage {
	constructor( page, pinId ) {
		super( page, { expectedSelectors: [ '.wp-block-jetpack-pinterest' ] } );
		this.pinId = pinId;
	}

	async isContentRendered( pinId ) {
		logger.step( 'Checking Pinterest rendered block content' );
		return this.isElementVisible( `span[data-pin-id='${ pinId }']` );
	}
}
