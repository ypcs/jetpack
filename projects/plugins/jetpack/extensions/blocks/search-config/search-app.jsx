/**
 * External dependencies
 */
import { Provider } from 'react-redux';

/**
 * Internal dependencies
 */
// import { getThemeOptions } from '../../../modules/search/instant-search/lib/dom';
import SearchApp from '../../../modules/search/instant-search/components/search-app';
import store from '../../../modules/search/instant-search/store';

const HARDCODED_CONFIG = {
	overlayOptions: {
		colorTheme: 'light',
		enableInfScroll: true,
		enableSort: true,
		highlightColor: '#e6f2e8',
		overlayTrigger: 'results',
		resultFormat: 'minimal',
		showPoweredBy: false,
	},
	homeUrl: 'https://jetpack.com',
	locale: 'en-US',
	postsPerPage: 10,
	siteId: 20115252,
	postTypes: {
		post: { singular_name: 'Post', name: 'Posts' },
		page: { singular_name: 'Page', name: 'Pages' },
		attachment: { singular_name: 'Media', name: 'Media' },
		security: { singular_name: 'Vulnerability', name: 'Vulnerabilities' },
		theme: { singular_name: 'Theme', name: 'Themes' },
		jetpack_support: { singular_name: 'Article', name: 'Support' },
	},
	webpackPublicPath: 'https://s0.wp.com/wp-content/mu-plugins/jetpack/_inc/build/instant-search/',
	isPhotonEnabled: true,
	isPrivateSite: false,
	isWpcom: true,
	defaultSort: 'relevance',
	excludedPostTypes: [],
	hasOverlayWidgets: true,
	widgets: [],
	// widgets: [
	// 	{
	// 		filters: [
	// 			{
	// 				name: 'Post Types',
	// 				type: 'post_type',
	// 				count: 10,
	// 				widget_id: 'jetpack-search-filters-3',
	// 				filter_id: 'post_type_0',
	// 			},
	// 			{
	// 				name: 'Categories',
	// 				type: 'taxonomy',
	// 				taxonomy: 'category',
	// 				count: 20,
	// 				widget_id: 'jetpack-search-filters-3',
	// 				filter_id: 'taxonomy_1',
	// 			},
	// 			{
	// 				name: 'Year',
	// 				type: 'date_histogram',
	// 				count: 5,
	// 				field: 'post_date',
	// 				interval: 'year',
	// 				widget_id: 'jetpack-search-filters-3',
	// 				filter_id: 'date_histogram_2',
	// 			},
	// 		],
	// 		widget_id: 'jetpack-search-filters-3',
	// 	},
	// ],
	widgetsOutsideOverlay: [],
	hasNonSearchWidgets: false,
	adminQueryFilter: {
		bool: {
			must_not: [ { term: { post_type: 'attachment' } }, { term: { post_type: 'security' } } ],
		},
	},
};

window.JetpackInstantSearchOptions = HARDCODED_CONFIG;
window.__webpack_public_path__ = HARDCODED_CONFIG.webpackPublicPath;

export default function SearchAppWrapper() {
	return (
		<Provider store={ store }>
			<SearchApp
				// aggregations={ buildFilterAggregations( [
				// 	...window[ SERVER_OBJECT_NAME ].widgets,
				// 	...window[ SERVER_OBJECT_NAME ].widgetsOutsideOverlay,
				// ] ) }
				// defaultSort={ window[ SERVER_OBJECT_NAME ].defaultSort }
				hasOverlayWidgets={ !! HARDCODED_CONFIG.hasOverlayWidgets }
				// initialHref={ window.location.href }
				initialOverlayOptions={ HARDCODED_CONFIG.overlayOptions }
				initialShowResults
				// themeOptions={ getThemeOptions( HARDCODED_CONFIG ) }
				options={ HARDCODED_CONFIG }
				shouldIntegrateWithDom={ false }
			/>
		</Provider>
	);
}
