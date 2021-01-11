// const defaultConfig = require( '@automattic/calypso-build/babel/default' )();

module.exports = () => ( {
	presets: [
		[
			require.resolve( '@babel/preset-env' ),
			{
				corejs: 3.6,
				modules: false,
				useBuiltIns: 'usage',
				// Exclude transforms that make all code slower, see https://github.com/facebook/create-react-app/pull/5278
				exclude: [ 'transform-typeof-symbol' ],
			},
		],
		[
			require.resolve( '@babel/preset-react' ),
			{
				pragma: 'h',
			},
		],
		require.resolve( '@babel/preset-typescript' ),
	],
	plugins: [
		require.resolve( '@babel/plugin-proposal-class-properties' ),
		[
			require.resolve( '@babel/plugin-transform-runtime' ),
			{
				corejs: false, // rely on polyfill from @babel/preset-env
				helpers: true,
				regenerator: false,
				useESModules: false,
				// Required until https://github.com/babel/babel/issues/10261 is unresolved.
				version: require( '@babel/helpers/package.json' ).version,
			},
		],
	],
} );
