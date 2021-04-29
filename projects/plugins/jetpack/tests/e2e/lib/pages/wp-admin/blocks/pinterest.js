import PageActions from '../../page-actions';
import config from 'config';
import logger from '../../../logger';

export default class PinterestBlock extends PageActions {
	constructor( blockId, page, pinId ) {
		super( page, 'Pinterest block' );
		this.blockSelector = '#block-' + blockId;
		this.pinId = pinId;
	}

	static name() {
		return 'pinterest';
	}

	static title() {
		return 'Pinterest';
	}

	get embedUrl() {
		return `${ config.get( 'blocks.pinterest.pinUrl' ) }/${ this.pinId }`;
	}

	//region selectors

	get inputSel() {
		return `${ this.blockSelector } .components-placeholder__input`;
	}

	get embedBtnSel() {
		return `${ this.blockSelector } button[type='submit']`;
	}

	get embeddedPinFrameSel() {
		return `${ this.blockSelector } .wp-block-jetpack-pinterest .components-sandbox`;
	}

	//endregion

	async addEmbed() {
		logger.step( `Embedding Pinterest pin [url: ${ this.embedUrl }]` );
		await this.type( this.inputSel, this.embedUrl );
		await this.click( this.embedBtnSel );
		await this.waitForElementToBeVisible( this.embeddedPinFrameSel );
	}
}
