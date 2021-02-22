<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Tests for the changelogger config.
 *
 * @package automattic/jetpack-changelogger
 */

// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.runtime_configuration_putenv, WordPress.WP.AlternativeFunctions, WordPress.NamingConventions.ValidVariableName

namespace Automattic\Jetpack\Changelogger\Tests;

use Automattic\Jetpack\Changelogger\Config;
use Automattic\Jetpack\Changelogger\PluginTrait;
use Automattic\Jetpack\Changelogger\VersioningPlugin;
use Symfony\Component\Console\Output\BufferedOutput;
use Wikimedia\TestingAccessWrapper;

/**
 * Tests for the changelogger config.
 *
 * @covers \Automattic\Jetpack\Changelogger\Config
 */
class ConfigTest extends TestCase {
	use \Yoast\PHPUnitPolyfills\Polyfills\ExpectException;

	/**
	 * Set up.
	 *
	 * @before
	 */
	public function set_up() {
		$this->useTempDir();

		file_put_contents( 'bogus.json', "bogus\n" );
		$this->writeComposerJson(
			array(
				'types'  => (object) array(),
				'foobar' => 'baz',
			),
			'no-types.json'
		);
	}

	/**
	 * Write a composer.json file.
	 *
	 * @param array  $config Contents for `.extra.changelogger`.
	 * @param string $file Filename.
	 */
	public function writeComposerJson( array $config, $file = 'composer.json' ) {
		file_put_contents(
			$file,
			json_encode(
				array( 'extra' => array( 'changelogger' => $config ) ),
				JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
			)
		);
	}

	/**
	 * Test that calling load() before setOutput() throws.
	 */
	public function testLoadBeforeSetOutput() {
		$this->resetConfigCache();

		$this->expectException( \LogicException::class );
		$this->expectExceptionMessage( 'Must call Config::setOutput() before Config::load()' );
		TestingAccessWrapper::newFromClass( Config::class )->load();
	}

	/**
	 * Test parsing composer.json.
	 *
	 * @dataProvider provideLoad
	 * @param string|false $composer Value for COMPOSER environment variable.
	 * @param string       $expectOut Expected console output.
	 * @param array        $expectConfig Expected configuration data.
	 */
	public function testLoad( $composer, $expectOut, $expectConfig ) {
		$expectConfig['base'] = getcwd();

		$this->resetConfigCache();
		putenv( false === $composer ? 'COMPOSER' : "COMPOSER=$composer" );
		$out = new BufferedOutput();
		Config::setOutput( $out );
		$w = TestingAccessWrapper::newFromClass( Config::class );
		$w->load();
		$this->assertSame( $expectOut, $out->fetch() );
		$this->assertEquals( $expectConfig, $w->config );

		// Second load call should do nothing.
		putenv( 'COMPOSER=./doesnotexist.json' );
		$w->load();
		$this->assertSame( '', $out->fetch() );
		$this->assertEquals( $expectConfig, $w->config );
	}

	/**
	 * Data provider for testLoad.
	 */
	public function provideLoad() {
		$defaultConfig = TestingAccessWrapper::newFromClass( Config::class )->defaultConfig;

		return array(
			'default'                 => array(
				false,
				'',
				$defaultConfig,
			),
			'Alternate composer.json' => array(
				'no-types.json',
				'',
				array(
					'types'  => array(),
					'foobar' => 'baz',
				) + $defaultConfig,
			),
			'missing composer.json'   => array(
				'missing.json',
				"File missing.json (as specified by the COMPOSER environment variable) is not found.\n",
				$defaultConfig,
			),
			'broken composer.json'    => array(
				'bogus.json',
				"File bogus.json (as specified by the COMPOSER environment variable) could not be parsed.\n",
				$defaultConfig,
			),
		);
	}

	/**
	 * Test the base method.
	 */
	public function testBase() {
		$this->resetConfigCache();
		$out = new BufferedOutput();
		Config::setOutput( $out );
		$this->assertSame( getcwd(), Config::base() );

		$this->resetConfigCache();
		putenv( 'COMPOSER=' . __DIR__ . '/../../../../composer.json' );
		Config::setOutput( $out );
		$this->assertSame( dirname( dirname( dirname( dirname( __DIR__ ) ) ) ), Config::base() );
	}

	/**
	 * Test the changelogFile method.
	 */
	public function testChangelogFile() {
		$this->resetConfigCache();
		$out = new BufferedOutput();
		Config::setOutput( $out );
		$this->assertSame( getcwd() . DIRECTORY_SEPARATOR . 'CHANGELOG.md', Config::changelogFile() );

		$this->resetConfigCache();
		$this->writeComposerJson( array( 'changelog' => 'changes.txt' ) );
		Config::setOutput( $out );
		$this->assertSame( getcwd() . DIRECTORY_SEPARATOR . 'changes.txt', Config::changelogFile() );

		$this->resetConfigCache();
		$this->writeComposerJson( array( 'changelog' => '/tmp/changes.md' ) );
		Config::setOutput( $out );
		$this->assertSame( '/tmp/changes.md', Config::changelogFile() );

		$this->resetConfigCache();
		$this->writeComposerJson( array( 'changelog' => 'c:\\changes.md' ) );
		Config::setOutput( $out );
		$this->assertSame( 'c:\\changes.md', Config::changelogFile() );
	}

	/**
	 * Test the changesDir method.
	 */
	public function testChangesDir() {
		$this->resetConfigCache();
		$out = new BufferedOutput();
		Config::setOutput( $out );
		$this->assertSame( getcwd() . DIRECTORY_SEPARATOR . 'changelog', Config::changesDir() );

		$this->resetConfigCache();
		$this->writeComposerJson( array( 'changes-dir' => 'changes' ) );
		Config::setOutput( $out );
		$this->assertSame( getcwd() . DIRECTORY_SEPARATOR . 'changes', Config::changesDir() );

		$this->resetConfigCache();
		$this->writeComposerJson( array( 'changes-dir' => '/tmp/changes' ) );
		Config::setOutput( $out );
		$this->assertSame( '/tmp/changes', Config::changesDir() );

		$this->resetConfigCache();
		$this->writeComposerJson( array( 'changes-dir' => 'c:\\changes' ) );
		Config::setOutput( $out );
		$this->assertSame( 'c:\\changes', Config::changesDir() );
	}

	/**
	 * Test the types method.
	 */
	public function testTypes() {
		$this->resetConfigCache();
		$out = new BufferedOutput();
		Config::setOutput( $out );
		$w = TestingAccessWrapper::newFromClass( Config::class );

		$this->assertSame( $w->defaultConfig['types'], Config::types() );

		$w->config = array(
			'types' => array(
				'FOO' => 'Stuff',
				'bAr' => 'More stuff',
			),
		);

		// No change because of caching.
		$this->assertSame( $w->defaultConfig['types'], Config::types() );

		// Clear cache, now it changes.
		$w->cache = array();
		$this->assertSame(
			array(
				'foo' => 'Stuff',
				'bar' => 'More stuff',
			),
			Config::types()
		);
	}

	/**
	 * Test the getPlugin method.
	 */
	public function testGetPlugin() {
		$w = TestingAccessWrapper::newFromClass( Config::class );

		if ( interface_exists( \PHPUnit\Framework\MockObject\MockObject::class ) ) {
			$mockinterface = \PHPUnit\Framework\MockObject\MockObject::class;
		} elseif ( interface_exists( \PHPUnit_Framework_MockObject_MockObject::class ) ) {
			$mockinterface = \PHPUnit_Framework_MockObject_MockObject::class;
		} else {
			$this->fail( "Couldn't find an interface for mock objects" );
		}

		// Get plugin by class.
		$mock1  = $this->getMockBuilder( PluginTrait::class )->getMockForTrait();
		$class1 = get_class( $mock1 );
		$this->assertInstanceOf( $class1, $w->getPlugin( array( 'class' => $class1 ), 'Dummy', $mockinterface ) );

		// Get plugin by name.
		$mock2  = $this->getMockBuilder( PluginTrait::class )->getMockForTrait();
		$class2 = get_class( $mock2 );
		class_alias( $class2, \Automattic\Jetpack\Changelogger\Plugins\FooDummy::class );
		$this->assertInstanceOf( $class2, $w->getPlugin( 'foo', 'Dummy', $mockinterface ) );
		$this->assertInstanceOf( $class2, $w->getPlugin( array( 'name' => 'foo' ), 'Dummy', $mockinterface ) );

		// Get by loading file, valid file.
		$ns        = __NAMESPACE__;
		$classBody = 'implements \\' . VersioningPlugin::class . " {\n\tuse \\" . PluginTrait::class . ";\n\tpublic function __construct( \$c ) { \$this->c = \$c; }\n\tpublic function nextVersion( \$version, array \$changes, array \$extra = array() ){}\n\tpublic function normalizeVersion( \$v ){}\n\tpublic function compareVersions( \$a, \$b ){}\n}";
		file_put_contents(
			'dummy.php',
			"<?php\nnamespace $ns;\nclass TestFromFile $classBody\n"
		);
		$ret = $w->getPlugin(
			array(
				'filename' => 'dummy.php',
				'option'   => 'value',
			),
			'Dummy',
			VersioningPlugin::class
		);
		$this->assertInstanceOf( __NAMESPACE__ . '\\TestFromFile', $ret );
		$this->assertSame(
			array(
				'filename' => 'dummy.php',
				'option'   => 'value',
			),
			$ret->c
		);

		// Get by loading file, file with no classes.
		file_put_contents( 'dummy2.php', "<?php\n" );
		$this->assertNull( $w->getPlugin( array( 'filename' => 'dummy2.php' ), 'Dummy', VersioningPlugin::class ) );

		// Get by loading file, file with no valid classes.
		file_put_contents(
			'dummy3.php',
			"<?php\nnamespace $ns;\nclass TestFromFile3 {}\n"
		);
		$this->assertNull( $w->getPlugin( array( 'filename' => 'dummy3.php' ), 'Dummy', VersioningPlugin::class ) );

		// Get by loading file, file with one valid class.
		file_put_contents(
			'dummy4.php',
			"<?php\nnamespace $ns;\nclass TestFromFile4a {}\nclass TestFromFile4b $classBody\n"
		);
		$ret = $w->getPlugin( array( 'filename' => 'dummy4.php' ), 'Dummy', VersioningPlugin::class );
		$this->assertInstanceOf( __NAMESPACE__ . '\\TestFromFile4b', $ret );

		// Get by loading file, file with two valid class.
		file_put_contents(
			'dummy5.php',
			"<?php\nnamespace $ns;\nclass TestFromFile5a $classBody\nclass TestFromFile5b $classBody\n"
		);
		$this->assertNull( $w->getPlugin( array( 'filename' => 'dummy5.php' ), 'Dummy', VersioningPlugin::class ) );

		// Test invalid class handling.
		$this->assertNull( $w->getPlugin( 'baz', 'Dummy', $mockinterface ) );

		// Test a config array with no valid plugin specifier.
		$this->assertNull( $w->getPlugin( array(), 'Dummy', $mockinterface ) );
	}

	/**
	 * Test the formatterPlugin method.
	 */
	public function testFormatterPlugin() {
		$this->resetConfigCache();
		$out = new BufferedOutput();
		Config::setOutput( $out );

		$this->assertInstanceOf(
			\Automattic\Jetpack\Changelogger\Plugins\KeepachangelogFormatter::class,
			Config::formatterPlugin()
		);
	}

	/**
	 * Test the formatterPlugin method error case.
	 */
	public function testFormatterPlugin_error() {
		$this->resetConfigCache();
		$this->writeComposerJson( array( 'formatter' => array( 'class' => 'foobar' ) ) );
		$out = new BufferedOutput();
		Config::setOutput( $out );

		$this->expectException( \RuntimeException::class );
		$this->expectExceptionMessage( "Unknown formatter plugin {\n    \"class\": \"foobar\"\n}" );
		Config::formatterPlugin();
	}

	/**
	 * Test the versioningPlugin method.
	 */
	public function testVersioningPlugin() {
		$this->resetConfigCache();
		$out = new BufferedOutput();
		Config::setOutput( $out );

		$this->assertInstanceOf(
			\Automattic\Jetpack\Changelogger\Plugins\SemverVersioning::class,
			Config::versioningPlugin()
		);
	}

	/**
	 * Test the versioningPlugin method error case.
	 */
	public function testVersioningPlugin_error() {
		$this->resetConfigCache();
		$this->writeComposerJson( array( 'versioning' => array( 'class' => 'foobar' ) ) );
		$out = new BufferedOutput();
		Config::setOutput( $out );

		$this->expectException( \RuntimeException::class );
		$this->expectExceptionMessage( "Unknown versioning plugin {\n    \"class\": \"foobar\"\n}" );
		Config::versioningPlugin();
	}

}
