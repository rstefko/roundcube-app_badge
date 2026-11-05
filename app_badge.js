(function () {
    'use strict';

    function updateBadge(value) {
        if (!('setAppBadge' in navigator) || !('clearAppBadge' in navigator)) {
            return;
        }

        var count = Number(value);
        if (!Number.isFinite(count) || count < 0) {
            count = 0;
        }

        try {
            if (count > 0) {
                var setResult = navigator.setAppBadge(Math.floor(count));
                if (setResult && typeof setResult.catch === 'function') {
                    setResult.catch(function () {});
                }
            } else {
                var clearResult = navigator.clearAppBadge();
                if (clearResult && typeof clearResult.catch === 'function') {
                    clearResult.catch(function () {});
                }
            }
        } catch (error) {
            // Badging is an optional browser feature; ignore unsupported or denied calls.
        }
    }

    if (!window.rcmail) {
        return;
    }

    rcmail.addEventListener('init', function () {
        rcmail.register_command('plugin.app_badge_update', function (count) {
            updateBadge(count);
        }, true);

        updateBadge(rcmail.env.app_badge_count || 0);
    });
})();
