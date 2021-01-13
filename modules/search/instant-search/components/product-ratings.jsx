/** @jsx h */
/**
 * External dependencies
 */
import { h } from 'preact';

/**
 * Internal dependencies
 */
import Gridicon from './gridicon';

/**
 * Style dependencies
 */
import './product-ratings.scss';

/**
 * Renders a hook-based component for displaying product ratings.
 *
 * @param {object} props - Component properties.
 * @param {number} props.count - Number of ratings.
 * @param {number} props.rating - Average rating out of five.
 * @returns {object} Product rating component.
 */
export default function ProductRatings( { rating = 0, count = 0 } ) {
	return (
		<div className="jetpack-instant-search__search-result-product-rating">
			<span aria-hidden className="jetpack-instant-search__search-result-product-rating-stars">
				{ Array( 5 )
					.fill( <Gridicon size={ 16 } icon="star-outline" /> )
					.fill( <Gridicon size={ 16 } icon="star" />, 0, rating ) }
			</span>{ ' ' }
			<span aria-hidden className="jetpack-instant-search__search-result-product-rating-count">
				{ count }
			</span>
			<span className="screen-reader-text">
				Average rating of { Number( rating ).toFixed( 2 ) } out of 5 from { count } ratings.
			</span>
		</div>
	);
}
