/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { hasError, isLoading, response } from './api';
import { searchQuery, sort } from './query-string';

export { hasError, isLoading, response, searchQuery, sort };
export default combineReducers( { hasError, isLoading, response, searchQuery, sort } );
