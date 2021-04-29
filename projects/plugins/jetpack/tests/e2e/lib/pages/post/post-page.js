/**
 * Internal dependencies
 */
import WpPage from '../wp-page';

export default class PostPage extends WpPage {
	constructor( page ) {
		super( page, { expectedSelectors: [ '.post' ] } );
	}
}
