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
        function syncBadge() {
            var match = document.title.match(/^\(([0-9]+)\)\s+/);
            updateBadge(match ? match[1] : 0);
        }

        var observer = new MutationObserver(syncBadge);
        observer.observe(document.head, {
            childList: true,
            characterData: true,
            subtree: true
        });

        syncBadge();
    });
})();
