import BlockEditorPage from '../lib/pages/wp-admin/block-editor';
import MailchimpBlock from '../lib/pages/wp-admin/blocks/mailchimp';
import { syncJetpackPlanData } from '../lib/flows/jetpack-connect';
import { activateModule, execMultipleWpCommands } from '../lib/utils-helper';
import PayPalBlock from '../lib/pages/wp-admin/blocks/paypal';
import WordAdsBlock from '../lib/pages/wp-admin/blocks/word-ads';
import { step } from '../lib/env/test-setup';
import WordAdsRenderedBlock from '../lib/pages/post/wordads-rendered-block';
import MailchimpRenderedBlock from '../lib/pages/post/mailchimp-rendered-block';
import PayPalRenderedBlock from '../lib/pages/post/paypal-rendered-block';
import PostPage from '../lib/pages/post/post-page';

/**
 *
 * @group post-connection
 * @group pro-blocks
 * @group blocks
 * @group gutenberg
 */
describe( 'Paid blocks', () => {
	let blockEditor;

	beforeAll( async () => {
		await syncJetpackPlanData( 'complete' );
		await activateModule( page, 'publicize' );
		await activateModule( page, 'wordads' );
	} );

	beforeEach( async () => {
		blockEditor = await BlockEditorPage.visit( page );
		await blockEditor.resolveWelcomeGuide( false );
	} );

	afterAll( async () => {
		await execMultipleWpCommands(
			'wp jetpack module deactivate publicize',
			'wp jetpack module deactivate wordads'
		);
	} );

	it( 'MailChimp Block', async () => {
		let blockId;

		await step( 'Can visit the block editor and add a MailChimp block', async () => {
			blockId = await blockEditor.insertBlock( MailchimpBlock.name(), MailchimpBlock.title() );
		} );

		await step( 'Can connect to a MailChimp', async () => {
			const mcBlock = new MailchimpBlock( blockId, page );
			await mcBlock.connect();
		} );

		await step( 'Can publish a post and assert that MailChimp block is rendered', async () => {
			await blockEditor.selectPostTitle();
			await blockEditor.publishPost();
			await blockEditor.viewPost();

			await PostPage.init( page );
			const renderedBlock = await MailchimpRenderedBlock.init( page );
			expect( await renderedBlock.isContentRendered() ).toBeTruthy();
		} );
	} );

	it( 'Pay with PayPal', async () => {
		let blockId;

		await step( 'Can visit the block editor and add a Pay with PayPal block', async () => {
			await blockEditor.waitForAvailableBlock( PayPalBlock.name() );

			blockId = await blockEditor.insertBlock( PayPalBlock.name(), PayPalBlock.title() );
		} );

		await step( 'Can fill details of Pay with PayPal block', async () => {
			const spBlock = new PayPalBlock( blockId, page );
			await spBlock.fillDetails();
		} );

		await step(
			'Can publish a post and assert that Pay with PayPal block is rendered',
			async () => {
				await blockEditor.selectPostTitle();
				await blockEditor.publishPost();
				await blockEditor.viewPost();

				await PostPage.init( page );
				const renderedBlock = await PayPalRenderedBlock.init( page );
				expect( await renderedBlock.isContentRendered() ).toBeTruthy();
			}
		);
	} );

	it( 'WordAds block', async () => {
		let blockId;

		await step( 'Can visit the block editor and add a WordAds block', async () => {
			await blockEditor.waitForAvailableBlock( WordAdsBlock.name() );
			blockId = await blockEditor.insertBlock( WordAdsBlock.name(), WordAdsBlock.title() );
			await blockEditor.selectPostTitle();
		} );

		await step( 'Can switch to Wide Skyscraper ad format', async () => {
			const adBlock = new WordAdsBlock( blockId, page );
			await adBlock.selectAd();
			await adBlock.switchFormat( 4 ); // switch to Wide Skyscraper ad format
		} );

		await step( 'Can publish a post and assert that WordAds block is rendered', async () => {
			await blockEditor.selectPostTitle();
			await blockEditor.publishPost();
			await blockEditor.viewPost();

			await PostPage.init( page );
			const renderedBlock = await WordAdsRenderedBlock.init( page );
			expect( await renderedBlock.isContentRendered() ).toBeTruthy();
		} );
	} );
} );
