import PageActions from '../../page-actions';
import config from 'config';
import logger from '../../../logger';

export default class EventbriteBlock extends PageActions {
	constructor( blockId, page, eventId ) {
		super( page, 'Eventbrite block' );
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
		return `${ this.blockSelector } .components-placeholder__input`;
	}

	get embedBtnSel() {
		return `${ this.blockSelector } button[type='submit']`;
	}

	get embeddedEventFrameSel() {
		return `${ this.blockSelector } .wp-block-jetpack-eventbrite .components-sandbox`;
	}

	//endregion

	async addEmbed() {
		logger.step( `Embedding Eventbrite event [url: ${ this.embedUrl }]` );
		await this.type( this.inputSel, this.embedUrl );
		await this.click( this.embedBtnSel );
		await this.waitForElementToBeVisible( this.embeddedEventFrameSel );
	}
}
