/* global expect */

/**
 * External dependencies
 */
import { h } from 'preact';
import { render } from '@testing-library/preact';
import '@testing-library/jest-dom/extend-expect';

/**
 * Internal dependencies
 */
import {
	makeSearchRequest,
	recordSuccessfulSearchRequest,
	recordFailedSearchRequest,
} from '../actions';
import { hasError, isLoading, response } from '../reducer';

describe( 'hasError Reducer', () => {
	test( 'defaults to false', () => {
		const state = hasError( undefined, {} );
		expect( state ).toBe( false );
	} );
	test( 'becomes true when a failed search request is recorded', () => {
		const state = hasError( undefined, recordFailedSearchRequest( new Error( 'Some error' ) ) );
		expect( state ).toBe( true );
	} );
	test( 'becomes false when a new search request is made', () => {
		const state = hasError( true, makeSearchRequest( {} ) );
		expect( state ).toBe( false );
	} );
	test( 'becomes false when a successful search request is recorded', () => {
		const state = hasError( true, recordSuccessfulSearchRequest( {} ) );
		expect( state ).toBe( false );
	} );
} );

describe( 'isLoading Reducer', () => {
	test( 'defaults to false', () => {
		const state = isLoading( undefined, {} );
		expect( state ).toBe( false );
	} );
	test( 'becomes true when a new search request is made', () => {
		const state = isLoading( undefined, makeSearchRequest( {} ) );
		expect( state ).toBe( true );
	} );
	test( 'becomes false when a failed search request is recorded', () => {
		const state = isLoading( true, recordFailedSearchRequest( new Error( 'Some error' ) ) );
		expect( state ).toBe( false );
	} );
	test( 'becomes false when a successful search request is recorded', () => {
		const state = isLoading( true, recordSuccessfulSearchRequest( {} ) );
		expect( state ).toBe( false );
	} );
} );

describe( 'response Reducer', () => {
	const actionOptions = { pageHandle: 'someString' };
	const actionResponse = {
		aggregations: { taxonomy_0: { buckets: [] } },
		results: [ { id: 1, result_type: 'post' } ],
	};
	test( 'defaults to an empty object', () => {
		const state = response( undefined, {} );
		expect( state ).toEqual( {} );
	} );
	test( 'is set to the response value when a successful search request is recorded', () => {
		const state = response(
			undefined,
			recordSuccessfulSearchRequest( {
				options: actionOptions,
				response: actionResponse,
			} )
		);
		expect( state ).toEqual( actionResponse );
	} );
	test( 'appends aggregations and results to previous paginated results', () => {
		const state = response(
			{
				aggregations: { taxonomy_1: { buckets: [] } },
				results: [ { id: 2, result_type: 'page' } ],
			},
			recordSuccessfulSearchRequest( {
				options: actionOptions,
				response: actionResponse,
			} )
		);
		expect( state ).toEqual( {
			aggregations: { taxonomy_1: { buckets: [] }, taxonomy_0: { buckets: [] } },
			results: [
				{ id: 2, result_type: 'page' },
				{ id: 1, result_type: 'post' },
			],
		} );
	} );
} );
