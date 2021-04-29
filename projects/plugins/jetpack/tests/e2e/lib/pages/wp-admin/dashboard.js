import WpPage from '../wp-page';

export default class DashboardPage extends WpPage {
	constructor( page ) {
		const url = `${ siteUrl }/wp-admin`;
		super( page, { expectedSelectors: [ '#dashboard-widgets-wrap' ], url } );
	}

	// region selectors

	get jetpackConnectBtnSel() {
		return ".jp-wpcom-connect__container a[href*='register']";
	}
	// endregion

	async isConnectBannerVisible() {
		return await this.isElementVisible( this.jetpackConnectBtnSel );
	}

	async connect() {
		return await this.click( this.jetpackConnectBtnSel );
	}
}
