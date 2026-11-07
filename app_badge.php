<?php
/**
 * Roundcube App Badge plugin
 * Mirrors the window title's unread count in the browser/PWA application badge.
 */
class app_badge extends rcube_plugin
{
    // Load only on the mail task
    public $task = 'mail';

    // Do not load within an iframe
    public $noframe = true;

    public function init()
    {
        $this->include_script('app_badge.js');
    }
}
