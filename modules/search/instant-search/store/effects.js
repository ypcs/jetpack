/**
 * Internal dependencies
 */
import { search } from '../../instant-search/lib/api';
import { getQuery, setQuery } from '../../instant-search/lib/query-string';
import {
	recordFailedSearchRequest,
	recordSuccessfulSearchRequest,
	setSearchQuery,
} from './actions';

/**
 * Effect handler which will fetch search results from the API.
 *
 * @param {object} action - Action which had initiated the effect handler.
 * @param {object} store -  Store instance.
 */
function makeSearchAPIRequest( action, store ) {
	search( action.options )
		.then( response => {
			if ( response === null ) {
				// Request has been cancelled by a more recent request.
				return;
			}

			store.dispatch( recordSuccessfulSearchRequest( { options: action.options, response } ) );
		} )
		.catch( error => {
			// eslint-disable-next-line no-console
			console.error( 'Jetpack Search encountered an error:', error );
			store.dispatch( recordFailedSearchRequest( error ) );
		} );
}

function initializeQueryValues( action, store ) {
	const queryObject = getQuery();
	store.dispatch( setSearchQuery( queryObject.s, false ) );
}

/**
 * Effect handler which will update the location bar's search query string
 *
 * @param {object} action - Action which had initiated the effect handler.
 * @param {object} store -  Store instance.
 */
function updateSearchQueryString( action ) {
	if ( action.propagateToWindow === false ) {
		return;
	}

	const queryObject = getQuery();
	if ( action.query === '' ) {
		delete queryObject.s;
	} else {
		queryObject.s = action.query;
	}
	setQuery( queryObject );
}

export default {
	INITIALIZE_QUERY_VALUES: initializeQueryValues,
	MAKE_SEARCH_REQUEST: makeSearchAPIRequest,
	SET_SEARCH_QUERY: updateSearchQueryString,
};
