/** @jsx h */

/**
 * External dependencies
 */
import { Component, h } from 'preact';

/**
 * Internal dependencies
 */
import JetpackColophon from './jetpack-colophon';
import SearchBox from './search-box';
import SearchFilters from './search-filters';
import './search-form.scss';

const noop = event => event.preventDefault();

class SearchForm extends Component {
	state = {
		showFilters: !! this.props.widget,
	};

	onChangeSearch = event => this.props.onChangeSearch( event.currentTarget.value );
	onChangeSort = sort => {
		this.props.onChangeSort( sort );
		this.hideFilters();
	};

	hideFilters = () => this.setState( () => ( { showFilters: false } ) );
	toggleFilters = event => {
		if (
			event.type === 'click' ||
			( event.type === 'keydown' && ( event.key === 'Enter' || event.key === ' ' ) )
		) {
			// Prevent page scroll from pressing spacebar
			if ( event.key === ' ' ) {
				event.preventDefault();
			}
			this.setState( state => ( { showFilters: ! state.showFilters } ) );
		}
	};

	// Used to show filters selected outside of the overlay visible.
	getWidgets() {
		let widgets = [ ...this.props.widgets.map( widget => ( { ...widget, isInOverlay: true } ) ) ];
		if ( this.props.widgetsOutsideOverlay?.filters?.length > 0 ) {
			widgets = [ { ...this.props.widgetsOutsideOverlay, isInOverlay: false }, ...widgets ];
		}
		return widgets;
	}

	render() {
		const widgets = this.getWidgets();
		return (
			<form autocomplete="off" onSubmit={ noop } role="search" className={ this.props.className }>
				<div className="jetpack-instant-search__search-form">
					<SearchBox
						enableFilters={ widgets.length > 0 }
						enableSort={ this.props.enableSort }
						isVisible={ this.props.isVisible }
						onChangeSearch={ this.onChangeSearch }
						onChangeSort={ this.onChangeSort }
						shouldRestoreFocus
						showFilters={ this.state.showFilters }
						searchQuery={ this.props.searchQuery }
						sort={ this.props.sort }
						toggleFilters={ this.toggleFilters }
					/>
				</div>
				{ widgets.length > 0 && this.state.showFilters && (
					<div className="jetpack-instant-search__search-form-filters">
						<div className="jetpack-instant-search__search-form-filters-arrow" />
						{ this.props.widgets.map( ( widget, index ) => (
							<SearchFilters
								filters={ this.props.filters }
								loading={ this.props.isLoading }
								locale={ this.props.locale }
								onChange={ this.hideFilters }
								postTypes={ this.props.postTypes }
								results={ this.props.response }
								showClearFiltersButton={ index === 0 }
								widget={ widget }
							/>
						) ) }
						<JetpackColophon locale={ this.props.locale } />
					</div>
				) }
			</form>
		);
	}
}

export default SearchForm;
