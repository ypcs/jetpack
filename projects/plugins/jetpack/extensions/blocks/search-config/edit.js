/**
 * External dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SearchConfigControls from './controls';
import SearchApp from './search-app';
import './editor.scss';

export default function SearchConfigEdit() {
	/**
	 * @returns {object} The UI displayed when user edits this block.
	 */

	// TODO: Create control for jetpack_search_excluded_post_types.

	return (
		<Fragment>
			<SearchConfigControls />
			<SearchApp />
		</Fragment>
	);
}
