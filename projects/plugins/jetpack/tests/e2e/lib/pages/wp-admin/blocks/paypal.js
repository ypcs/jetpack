import PageActions from '../../page-actions';

export default class PayPalBlock extends PageActions {
	constructor( blockId, page ) {
		super( page, 'Pay with PayPal block' );
		this.blockSelector = '#block-' + blockId;
	}

	static name() {
		return 'simple-payments';
	}

	static title() {
		return 'Pay with PayPal';
	}

	// region selectors

	get itemNameInputSel() {
		return `${ this.blockSelector } .simple-payments__field-title input`;
	}

	get itemDescriptionTextAreaSel() {
		return `${ this.blockSelector } .simple-payments__field-content textarea`;
	}

	get itemPriceInputSel() {
		return `${ this.blockSelector } .simple-payments__field-price input`;
	}

	get emailInputSel() {
		return `${ this.blockSelector } .simple-payments__field-email input`;
	}

	// endregion

	async fillDetails( {
		title = `SP test ${ new Date() }`,
		description = 'random product description',
		price = '23.42',
		email = 'test@example.com',
	} = {} ) {
		await this.type( this.itemNameInputSel, title );
		await this.type( this.itemDescriptionTextAreaSel, description );
		await this.type( this.itemPriceInputSel, price );
		await this.type( this.emailInputSel, email );
	}
}
