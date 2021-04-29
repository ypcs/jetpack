import PageActions from '../../page-actions';

export default class WordAdsBlock extends PageActions {
	constructor( blockId, page ) {
		super( page, 'Ad block' );
		this.blockSelector = '#block-' + blockId;
	}

	static name() {
		return 'wordads';
	}

	static title() {
		return 'Ad';
	}

	// region selectors

	get formatPickerBtnSel() {
		return `.wp-block-jetpack-wordads__format-picker-icon`;
	}

	getFormatNumberSel( number ) {
		return `.wp-block-jetpack-wordads__format-picker button:nth-child(${ number })`;
	}

	get adContainerSel() {
		return `${ this.blockSelector } .jetpack-wordads__ad`;
	}

	// endregion

	async switchFormat( buttonNumber ) {
		await this.click( this.formatPickerBtnSel );
		return await this.click( this.getFormatNumberSel( buttonNumber ) );
	}

	async selectAd() {
		return await this.click( this.adContainerSel );
	}
}
