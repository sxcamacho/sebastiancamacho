<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'sebastiancamacho');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'pepeloco');

/** MySQL hostname */
define('DB_HOST', '127.0.0.1');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'D8d_]#SuF0i|`n)r<68{$SeELw8T<@/nYu#vD:H}@s.bq3b,J0H;wsn,/-AlV|Gn');
define('SECURE_AUTH_KEY',  '5gn@]<vntK}z0%J0LqNKX+^*cNt71$rxbZ{dpO?;h@LLF/|;u@@ZztO2$,8#>>W{');
define('LOGGED_IN_KEY',    ' Fg={BjLOq;Xb^JPbb-8&VJtwrEk%V]GLyi:$U(k66hNsd]m/{@v]5fruho2X]/7');
define('NONCE_KEY',        'T+vX(qO{>D@ROt5&hcUM.Y)Sn)VRmUCh)}RBRmR,3I%I42Z2BBu1#WR_/yp^Vkv>');
define('AUTH_SALT',        'yao|b2`bnIwP>NL<@d;[XSWL@Q;cetz!!v@ r3<e){tH./-R1|4=AhA7Hx8?O- !');
define('SECURE_AUTH_SALT', 'o!9d@2fSs9MH?5U,7Dg(dVRZl4O,Q1vw$Z2aHK-yj~xJ==~.xg{+uTv_Y:O5Dk{j');
define('LOGGED_IN_SALT',   '>*GS;DT]1@mF])*#/B]@x12e9D#wt.W5B:~5}I0!F<WyhjyDZ%<TW.<oZ_!M)x=5');
define('NONCE_SALT',       '}c1@4d<4Yu(Y60]lb1_T2RW.mCcx,)oR!OfhG0?^mP{rO4%b:B63UKx&sjtL5%bw');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
