import apiFetch from '@wordpress/api-fetch';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, Spinner, ToggleControl, withNotices } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, _x, sprintf } from '@wordpress/i18n';
import './editor.scss';
import icon from './icon';
import { usePromptTags } from './use-prompt-tags';

function BloggingPromptEdit( { attributes, noticeOperations, noticeUI, setAttributes } ) {
	const fetchedPromptRef = useRef( false );
	const [ isLoading, setLoading ] = useState( true );
	const { gravatars, prompt, promptId, showLabel, showResponses, tagsAdded } = attributes;
	const blockProps = useBlockProps( { className: 'jetpack-blogging-prompt' } );

	const setTagsAdded = state => setAttributes( { tagsAdded: state } );

	// Add the prompt tags to the post, if they haven't already been added.
	usePromptTags( promptId, tagsAdded, setTagsAdded );

	// Fetch the prompt by id, if present, otherwise the get the prompt for today.
	useEffect( () => {
		// Only fetch the prompt once.
		if ( fetchedPromptRef.current ) {
			return;
		}

		const retryPrompt = () => {
			setLoading( true );
			fetchedPromptRef.current = false;
			noticeOperations.removeAllNotices();
		};

		const resetPrompt = () => {
			setAttributes( { promptId: null } );
			retryPrompt();
		};

		const errorMessage = message => (
			<>
				{ sprintf(
					/* translators: %s is the error message. */
					__( 'Error while fetching prompt: %s', 'jetpack' ),
					message
				) }{ ' ' }
				<Button variant="link" onClick={ retryPrompt }>
					{ __( 'Retry', 'jetpack' ) }
				</Button>
			</>
		);

		const notFoundMessage = pId => (
			<>
				{ sprintf(
					/* translators: %d is the prompt id. */
					__( 'Prompt with id %d not found.', 'jetpack' ),
					pId
				) }{ ' ' }
				<Button variant="link" onClick={ resetPrompt }>
					{ __( 'Reset prompt', 'jetpack' ) }
				</Button>
			</>
		);

		let path = '/wpcom/v3/blogging-prompts';

		if ( promptId ) {
			path += '/' + encodeURIComponent( promptId );
		} else {
			const date = new Date();

			// Current month and day with leading zeros.
			const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
			const day = date.getDate().toString().padStart( 2, '0' );

			path += `?after=--${ month }-${ day }&order=desc`;
		}

		fetchedPromptRef.current = true;
		apiFetch( { path } )
			.then( prompts => {
				const promptData = promptId ? prompts : prompts[ 0 ];

				setLoading( false );
				setAttributes( {
					gravatars: promptData.answered_users_sample.map( ( { avatar } ) => ( { url: avatar } ) ),
					prompt: promptData.text,
					promptId: promptData.id,
				} );
			} )
			.catch( error => {
				setLoading( false );
				const message =
					error.code === 'rest_post_invalid_id' && promptId
						? notFoundMessage( promptId )
						: errorMessage( error.message );
				noticeOperations.removeAllNotices();
				noticeOperations.createErrorNotice( message );
			} );
	}, [ fetchedPromptRef, isLoading, noticeOperations, promptId, setAttributes, setLoading ] );

	const onShowLabelChange = newValue => {
		setAttributes( { showLabel: newValue } );
	};

	const onShowResponsesChange = newValue => {
		setAttributes( { showResponses: newValue } );
	};

	const renderControls = () => (
		<>
			<InspectorControls>
				<PanelBody title={ _x( 'Settings', 'title of block settings sidebar section', 'jetpack' ) }>
					<ToggleControl
						label={ __( 'Show daily prompt label', 'jetpack' ) }
						checked={ showLabel }
						onChange={ onShowLabelChange }
					/>
					<ToggleControl
						label={ __( 'Show other responses', 'jetpack' ) }
						checked={ showResponses }
						onChange={ onShowResponsesChange }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);

	const renderPrompt = () => (
		<>
			{ showLabel && (
				<div className="jetpack-blogging-prompt__label">
					{ icon }
					{ __( 'Daily writing prompt', 'jetpack' ) }
				</div>
			) }

			<div className="jetpack-blogging-prompt__prompt">{ prompt }</div>

			{ showResponses && promptId && (
				<div className="jetpack-blogging-prompt__answers">
					{ gravatars &&
						gravatars.slice( 0, 3 ).map( ( { url } ) => {
							return (
								url && (
									// eslint-disable-next-line jsx-a11y/alt-text
									<img
										className="jetpack-blogging-prompt__answers-gravatar"
										// Gravatar are decorative, here.
										src={ url }
										key={ url }
									/>
								)
							);
						} ) }

					<a
						className="jetpack-blogging-prompt__answers-link"
						href={ `https://wordpress.com/tag/dailyprompt-${ promptId }` }
						target="_blank"
						rel="external noreferrer noopener"
					>
						{ __( 'View all responses', 'jetpack' ) }
					</a>
				</div>
			) }
		</>
	);

	return (
		<div { ...blockProps }>
			{ noticeUI }
			{ renderControls() }

			{ isLoading ? (
				<div className="jetpack-blogging-prompt__spinner">
					<Spinner />
				</div>
			) : (
				renderPrompt()
			) }
		</div>
	);
}

export default withNotices( BloggingPromptEdit );