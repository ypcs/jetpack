<?php

use Automattic\Jetpack\Assets;

if ( ! class_exists( 'Jetpack_MailChimp_Subscriber_Popup_Widget' ) ) {

	if ( ! class_exists( 'MailChimp_Subscriber_Popup' ) ) {
		include_once JETPACK__PLUGIN_DIR . 'modules/shortcodes/mailchimp.php';
	}

	//register MailChimp Subscriber Popup widget
	function jetpack_mailchimp_subscriber_popup_widget_init() {
		register_widget( 'Jetpack_MailChimp_Subscriber_Popup_Widget' );
	}

	add_action( 'widgets_init', 'jetpack_mailchimp_subscriber_popup_widget_init' );

	/**
	 * Add a MailChimp subscription form.
	 */
	class Jetpack_MailChimp_Subscriber_Popup_Widget extends WP_Widget {

		/**
		 * Array contaning the section and fields of the widget form.
		 *
		 * @var array
		 */
		protected $form_sections;

		/**
		 * Array contaning the data for the placeholder view.
		 *
		 * @var array
		 */
		protected $placeholder_data;

		/**
		 * Constructor
		 */
		public function __construct() {
			parent::__construct(
				'widget_mailchimp_subscriber_popup',
				/** This filter is documented in modules/widgets/facebook-likebox.php */
				apply_filters( 'jetpack_widget_name', __( 'MailChimp Subscriber Popup', 'jetpack' ) ),
				array(
					'classname'                   => 'widget_mailchimp_subscriber_popup',
					'description'                 => __( 'Allows displaying a popup subscription form to visitors.', 'jetpack' ),
					'customize_selective_refresh' => true,
				)
			);

			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
		}

		/**
		 * Outputs the HTML for this widget.
		 *
		 * @param array $args     An array of standard parameters for widgets in this theme.
		 * @param array $instance An array of settings for this widget instance.
		 *
		 * @return void Echoes it's output
		 **/
		public function widget( $args, $instance ) {
			$instance = wp_parse_args( $instance, array( 'code' => '' ) );

			// Regular expresion that will match maichimp shortcode.
			$regex = '(\[mailchimp_subscriber_popup[^\]]+\])';

			// Check if the shortcode exists.
			preg_match( $regex, $instance['code'], $matches );

			// Process the shortcode only, if exists.
			if ( ! empty( $matches[0] ) ) {
				echo do_shortcode( $matches[0] );
			}

			/** This action is documented in modules/widgets/gravatar-profile.php */
			do_action( 'jetpack_stats_extra', 'widget_view', 'mailchimp_subscriber_popup' );
		}


		/**
		 * Deals with the settings when they are saved by the admin.
		 *
		 * @param array $new_instance New configuration values.
		 * @param array $old_instance Old configuration values.
		 *
		 * @return array
		 */
		public function update( $new_instance, $old_instance ) {
			$instance         = array();
			$instance['code'] = MailChimp_Subscriber_Popup::reversal( $new_instance['code'] );

			return $instance;
		}

		/**
		 * Enqueue the scripts for the widget.
		 *
		 * @return void
		 */
		public function enqueue_admin_scripts() {
			global $pagenow;

			if ( 'widgets.php' === $pagenow ) {
				wp_enqueue_script(
					'mailchimp-admin',
					Assets::get_file_url_for_environment(
						'_inc/build/widgets/mailchimp/js/admin.min.js',
						'modules/widgets/mailchimp/js/admin.js'
					),
					array( 'jquery', 'wp-color-picker' ),
					'20200607',
					true
				);

				wp_enqueue_style( 'wp-color-picker' );
			}
		}


		/**
		 * Displays the form for this widget on the Widgets page of the WP Admin area.
		 *
		 * @param array $instance Instance configuration.
		 *
		 * @return void
		 */
		public function form( $instance ) {
			$instance = wp_parse_args(
				$instance,
				array(
					'code'              => '',
					'email_placeholder' => '',
					'processing_text'   => '',
					'success_text'      => '',
					'error_text'        => '',
					'groups'            => '',
					'signup_tag'        => '',
					'signup_value'      => '',
					'button_color'      => '',
					'text_color'        => '',
					'css_class'         => '',
				)
			);

			$this->form_sections = array(
				array(
					'title'  => __( 'Text Elements', 'jetpack' ),
					'fields' => array(
						array(
							'title'       => __( 'Email Placeholder', 'jetpack' ),
							'id'          => 'jetpack_mailchimp_email',
							'placeholder' => __( 'Enter your email', 'jetpack' ),
							'type'        => 'text',
							'name'        => esc_attr( $this->get_field_name( 'email_placeholder' ) ),
							'value'       => esc_html( $instance['email_placeholder'] ),
						),
					),
				),

				array(
					'title'  => __( 'Notifications', 'jetpack' ),
					'fields' => array(
						array(
							'title'       => __( 'Processing', 'jetpack' ),
							'id'          => 'jetpack_mailchimp_processing_text',
							'placeholder' => __( 'Processing', 'jetpack' ),
							'type'        => 'text',
							'name'        => esc_attr( $this->get_field_name( 'processing_text' ) ),
							'value'       => esc_html( $instance['processing_text'] ),
						),

						array(
							'title'       => __( 'Success text', 'jetpack' ),
							'id'          => 'jetpack_mailchimp_success_text',
							'placeholder' => __( 'Success! You\'re on the list.', 'jetpack' ),
							'type'        => 'text',
							'name'        => esc_attr( $this->get_field_name( 'success_text' ) ),
							'value'       => esc_html( $instance['success_text'] ),
						),

						array(
							'title'       => __( 'Error text', 'jetpack' ),
							'id'          => 'jetpack_mailchimp_error_text',
							'placeholder' => __( 'Whoops! There was an error and we couldn\'t process your subscription. Please reload the page and try again.', 'jetpack' ),
							'type'        => 'text',
							'name'        => esc_attr( $this->get_field_name( 'error_text' ) ),
							'value'       => esc_html( $instance['error_text'] ),
						),
					),
				),

				array(
					'title'         => __( 'Mailchimp Groups', 'jetpack' ),
					'fields'        => array(
						array(
							'type' => 'groups',
						),
					),
					'extra_content' => array(
						array(
							'text' => __( 'Learn about groups', 'jetpack' ),
							'link' => 'https://mailchimp.com/help/send-groups-audience/',
							'type' => 'link',
						),
					),
				),

				array(
					'title'         => __( 'Signup Location Tracking', 'jetpack' ),
					'fields'        => array(
						array(
							'title'       => __( 'Signup Field Tag', 'jetpack' ),
							'id'          => 'jetpack_mailchimp_signup_tag',
							'placeholder' => __( 'SIGNUP', 'jetpack' ),
							'type'        => 'text',
							'name'        => esc_attr( $this->get_field_name( 'signup_tag' ) ),
							'value'       => esc_html( $instance['signup_tag'] ),
						),

						array(
							'title'       => __( 'Signup Field Value', 'jetpack' ),
							'id'          => 'jetpack_mailchimp_signup_value',
							'placeholder' => __( 'website', 'jetpack' ),
							'type'        => 'text',
							'name'        => esc_attr( $this->get_field_name( 'signup_value' ) ),
							'value'       => esc_html( $instance['signup_value'] ),
						),
					),
					'extra_content' => array(
						array(
							'text' => __( 'Learn about signup location tracking(opens in a new tab)', 'jetpack' ),
							'link' => 'https://mailchimp.com/help/determine-webpage-signup-location/',
							'type' => 'link',
						),
					),
				),

				array(
					'title'         => __( 'Mailchimp Connection', 'jetpack' ),
					'extra_content' => array(
						array(
							'text' => __( 'Manage Connection', 'jetpack' ),
							'link' => 'https://jetpack.com/redirect?source=calypso-marketing-connections&site=[site_url]&query=mailchimp',
							'type' => 'link',
						),
					),
				),

				array(
					'title'  => __( 'Button Color Settings', 'jetpack' ),
					'fields' => array(
						array(
							'id'      => 'jetpack_mailchimp_button_color',
							'type'    => 'color',
							'value'   => esc_html( $instance['button_color'] ),
							'default' => '#cd2653',
							'name'    => esc_attr( $this->get_field_name( 'button_color' ) ),
							'label'   => __( 'Button Color', 'jetpack' ),
						),

						array(
							'id'      => 'jetpack_mailchimp_button_text_color',
							'type'    => 'color',
							'value'   => esc_html( $instance['text_color'] ),
							'default' => '#ffffff',
							'name'    => esc_attr( $this->get_field_name( 'text_color' ) ),
							'label'   => __( 'Button Text Color', 'jetpack' ),
						),
					),
				),

				array(
					'title'  => __( 'Advanced', 'jetpack' ),
					'fields' => array(
						array(
							'title'       => __( 'Additional CSS class(es)', 'jetpack' ),
							'id'          => 'jetpack_mailchimp_css_class',
							'placeholder' => '',
							'help_text'   => __( 'Separate multiple classes with spaces.', 'jetpack' ),
							'type'        => 'text',
							'name'        => esc_attr( $this->get_field_name( 'css_class' ) ),
							'value'       => esc_html( $instance['css_class'] ),
						),
					),
				),
			);

			$this->placeholder_data = array(
				'instructions'    => __( 'You need to connect your Mailchimp account and choose a list in order to start collecting Email subscribers.', 'jetpack' ),
				'setupButtonText' => __( 'Set up Mailchimp form', 'jetpack' ),
				'recheckText'     => __( 'Re-check Connection', 'jetpack' ),
			);

			wp_localize_script(
				'mailchimp-admin',
				'mailchimpAdmin',
				array(
					'formSections'    => $this->form_sections,
					'placeholderData' => $this->placeholder_data,
					'groups'          => esc_html( $instance['groups'] ),
					'groupsFieldName' => esc_attr( $this->get_field_name( 'groups' ) ),
				)
			);

			if ( empty( $instance['code'] ) ) {
				?>
					<div class="mailchimp_widget_jetpack_form_wrapper"></div>
				<?php
				return;
			}

			?>

			<p class="mailchimp_code">
				<label for="<?php echo esc_attr( $this->get_field_id( 'code' ) ); ?>">
					<?php printf( __( 'Code: <a href="%s" target="_blank">( ? )</a>', 'jetpack' ), 'https://en.support.wordpress.com/mailchimp/' ); ?>
				</label>
				<textarea class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'code' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'code' ) ); ?>" rows="3"><?php echo esc_textarea( $instance['code'] ); ?></textarea>
			</p>
			<p>
				<input type="checkbox" id="jetpack_mailchimp_new_form" name="<?php echo esc_attr( $this->get_field_name( 'new_form' ) ); ?>" > <?php echo esc_html__( 'Check if you want to use the new form for this widget (the code in the box above will be deleted)', 'jetpack' ); ?>
			</p>
			<div class="mailchimp_widget_jetpack_form_wrapper"></div>
			<?php
		}

	}

}
