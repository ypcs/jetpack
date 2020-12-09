/**
 * Reducer for keeping track of the user's inputted search query
 *
 * @param {object} state - Current state.
 * @param {object} action - Dispatched action.
 *
 * @returns {object} Updated state.
 */
export function searchQuery( state = '', action ) {
	switch ( action.type ) {
		case 'SET_SEARCH_QUERY':
			return action.query;
	}

	return state;
}
