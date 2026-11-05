<?php
/**
 * Roundcube App Badge plugin
 * Sets the browser/PWA application badge to the number of unseen messages.
 */
class app_badge extends rcube_plugin
{
    public $task = 'mail';

    public function init()
    {
        $this->load_config();
        $this->include_script('app_badge.js');
        $this->add_hook('refresh', [$this, 'refresh']);

        $rcmail = rcmail::get_instance();
        $rcmail->output->set_env('app_badge_count', $this->get_unread_count());
    }

    /** Update the badge during Roundcube's regular AJAX refresh cycle. */
    public function refresh($args)
    {
        $rcmail = rcmail::get_instance();
        $rcmail->output->command(
            'plugin.app_badge_update',
            $this->get_unread_count()
        );

        return $args;
    }

    /** Return the number of unseen messages in the configured mailbox. */
    private function get_unread_count()
    {
        $rcmail = rcmail::get_instance();
        $folder = (string) $this->get_config('folder', 'INBOX');

        if (!$rcmail->storage || !method_exists($rcmail->storage, 'count')) {
            return 0;
        }

        try {
            return max(0, (int) $rcmail->storage->count($folder, 'UNSEEN'));
        } catch (Throwable $e) {
            rcube::raise_error([
                'code' => 0,
                'type' => 'php',
                'message' => 'app_badge: unable to count unseen messages: ' . $e->getMessage(),
            ], true, false);

            return 0;
        }
    }
}
