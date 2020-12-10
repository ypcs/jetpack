/**
 * External dependencies
 */
import 'url-polyfill';
import { encode } from 'qss';

/**
 * Internal dependencies
 */
import { SERVER_OBJECT_NAME, VALID_RESULT_FORMAT_KEYS } from './constants';
import { getFilterKeys, getUnselectableFilterKeys, mapFilterToFilterKey } from './filters';
import { decode } from '../external/query-string-decode';

export function getQuery() {
	return decode( window.location.search.substring( 1 ), false, false );
}

export function setQuery( queryObject ) {
	pushQueryString( encode( queryObject ), false );
}

function pushQueryString( queryString, shouldEmitEvent = true ) {
	if ( history.pushState ) {
		const url = new window.URL( window.location.href );
		if ( window[ SERVER_OBJECT_NAME ] && 'homeUrl' in window[ SERVER_OBJECT_NAME ] ) {
			url.href = window[ SERVER_OBJECT_NAME ].homeUrl;
		}
		url.search = queryString;
		window.history.pushState( null, null, url.toString() );
		shouldEmitEvent && window.dispatchEvent( new Event( 'queryStringChange' ) );
	}
}

function getFilterQueryByKey( filterKey ) {
	const query = getQuery();
	if ( ! ( filterKey in query ) || query[ filterKey ] === '' ) {
		return [];
	}
	if ( typeof query[ filterKey ] === 'string' ) {
		return [ query[ filterKey ] ];
	}
	return query[ filterKey ];
}

export function getFilterQuery( filterKey ) {
	if ( filterKey ) {
		return getFilterQueryByKey( filterKey );
	}

	return Object.assign(
		{},
		...getFilterKeys().map( key => ( {
			[ key ]: getFilterQueryByKey( key ),
		} ) )
	);
}

// These filter keys have been activated/selected outside of the overlay sidebar
export function getPreselectedFilterKeys( overlayWidgets ) {
	return getUnselectableFilterKeys( overlayWidgets ).filter(
		key => Array.isArray( getFilterQueryByKey( key ) ) && getFilterQueryByKey( key ).length > 0
	);
}

export function getPreselectedFilters( widgetsInOverlay, widgetsOutsideOverlay ) {
	const keys = getPreselectedFilterKeys( widgetsInOverlay );
	return widgetsOutsideOverlay
		.map( widget => widget.filters )
		.reduce( ( prev, current ) => prev.concat( current ), [] )
		.filter( filter => keys.includes( mapFilterToFilterKey( filter ) ) );
}

export function hasPreselectedFilters( widgetsInOverlay, widgetsOutsideOverlay ) {
	return getPreselectedFilters( widgetsInOverlay, widgetsOutsideOverlay ).length > 0;
}

export function hasFilter() {
	return getFilterKeys().some( key => getFilterQueryByKey( key ).length > 0 );
}

export function clearFiltersFromQuery() {
	const query = getQuery();
	getFilterKeys().forEach( key => delete query[ key ] );
	pushQueryString( encode( query ) );
}

export function setFilterQuery( filterKey, filterValue ) {
	const query = getQuery();
	query[ filterKey ] = filterValue;
	pushQueryString( encode( query ) );
}

export function getResultFormatQuery() {
	const query = getQuery();

	if ( ! VALID_RESULT_FORMAT_KEYS.includes( query.result_format ) ) {
		return null;
	}

	return query.result_format;
}

export function restorePreviousHref( initialHref, callback ) {
	if ( history.pushState ) {
		window.history.pushState( null, null, initialHref );

		const query = getQuery();
		const keys = [ ...getFilterKeys(), 's' ];
		// If initialHref has search or filter query values, clear them and reload.
		if ( Object.keys( query ).some( key => keys.includes( key ) ) ) {
			keys.forEach( key => delete query[ key ] );
			pushQueryString( encode( query ), false );
			window.location.reload( true );
			return;
		}

		// Otherwise, invoke the callback
		callback();
	}
}
