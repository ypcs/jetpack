/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { hasError, isLoading, response } from './api';

export default combineReducers( { hasError, isLoading, response } );
