# App Badge for Roundcube

A small Roundcube plugin that sets the browser/PWA application badge to the number of unseen messages in one mailbox (by default `INBOX`). It uses the browser Badging API (`navigator.setAppBadge()` / `navigator.clearAppBadge()`).

## Installation

1. Copy the `app_badge` directory into your Roundcube `plugins/` directory.
2. Optionally copy `config.inc.php.dist` to `config.inc.php` and change `$config['folder']` to the mailbox you want to count.
3. Add `app_badge` to the `$config['plugins']` array in Roundcube's `config/config.inc.php`.
4. Sign in to Roundcube using a browser that supports the Badging API.

Example:

```php
$config['plugins'] = [
    // Keep your existing plugins here.
    'app_badge',
];
```

## Behavior and limitations

- The badge reflects unseen messages in the configured mailbox, not the sum of every folder.
- The count is set when the mail interface loads and refreshed during Roundcube's normal AJAX refresh cycle.
- Browser and operating-system support varies. The Badging API generally requires a secure context (HTTPS) and is most useful when the site is installed as a PWA.
- The plugin does not register a service worker or make Roundcube installable as a PWA; those are separate deployment concerns.
- If the browser does not expose the Badging API, the plugin does nothing.

## Compatibility note

This plugin uses the Roundcube plugin API and storage count method. It has not been run against your particular Roundcube installation, so test it on a staging instance first and check `logs/errors.log` if your Roundcube version exposes a different storage API.
