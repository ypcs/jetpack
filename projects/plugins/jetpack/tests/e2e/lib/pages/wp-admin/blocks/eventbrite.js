import PageActions from '../../page-actions';
import config from 'config';
import logger from '../../../logger';

export default class EventbriteBlock extends PageActions {
	constructor( blockId, page, eventId ) {
		super( page, 'Eventbrite block' );
		this.blockTitle = EventbriteBlock.title();
		this.blockSelector = '#block-' + blockId;
		this.eventId = eventId;
	}

	static name() {
		return 'eventbrite';
	}

	static title() {
		return 'Eventbrite';
	}

	get embedUrl() {
		return `${ config.get( 'blocks.eventbrite.eventUrl' ) }/${ this.eventId }`;
	}

	//region selectors

	get inputSel() {
		return '.components-placeholder__input';
	}

	get embedBtnSel() {
		return "button[type='submit']";
	}

	get embeddedEventFrameSel() {
		return '.wp-block-jetpack-eventbrite .components-sandbox';
	}

	//endregion

	async addEmbed() {
		logger.step( `Embedding Eventbrite event [url: ${ this.embedUrl }]` );
		await this.type( this.inputSel, this.embedUrl );
		await this.click( this.embedBtnSel );
		await this.waitForElementToBeVisible( this.embeddedEventFrameSel );
	}

	/**
	 * Checks whether block is rendered on frontend
	 *
	 * @param {page} page Playwright page instance
	 * @param {Object} args An object of any additional required instance values
	 */
	static async isRendered( page, args ) {
		const containerSelector = `.entry-content iframe[data-automation='checkout-widget-iframe-${ args.eventId }']`;

		await page.waitForSelector( containerSelector );
	}
}
