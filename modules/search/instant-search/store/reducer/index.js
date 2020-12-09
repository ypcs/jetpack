/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { hasError, isLoading, response } from './api';
import { searchQuery } from './query-string';

export { hasError, isLoading, response, searchQuery };
export default combineReducers( { hasError, isLoading, response, searchQuery } );
