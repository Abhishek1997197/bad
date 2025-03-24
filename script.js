let isBlockingEnabled = false;

document.getElementById("enable").addEventListener("click", function() {
    isBlockingEnabled = true;
    alert("Tab blocking enabled! No new tabs will open.");
});

document.getElementById("disable").addEventListener("click", function() {
    isBlockingEnabled = false;
    alert("Tab blocking disabled!");
});

// Completely disable window.open
(function() {
    const originalOpen = window.open;
    window.open = function() {
        if (isBlockingEnabled) {
            alert("New tabs are blocked!");
            return null;
        } else {
            return originalOpen.apply(window, arguments);
        }
    };
})();

// Prevent links from opening in a new tab
document.addEventListener("click", function(event) {
    if (isBlockingEnabled) {
        let target = event.target.closest("a");
        if (target && target.getAttribute("target") === "_blank") {
            event.preventDefault();
            alert("New tab opening blocked!");
        }
    }
}, true);

// Block keyboard shortcuts that open new tabs
document.addEventListener("keydown", function(event) {
    if (isBlockingEnabled) {
        if ((event.ctrlKey || event.metaKey) && (event.key === "t" || event.key === "n")) {
            event.preventDefault();
            alert("New tab opening blocked!");
        }
    }
});

// Block middle mouse button and Shift+Click from opening new tabs
document.addEventListener("mousedown", function(event) {
    if (isBlockingEnabled && (event.button === 1 || event.shiftKey)) {
        event.preventDefault();
        alert("New tab opening blocked!");
    }
}, true);

// Monitor and override any attempt to create popups
const observer = new MutationObserver((mutations) => {
    if (isBlockingEnabled) {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLIFrameElement || node instanceof HTMLAnchorElement) {
                    node.remove();
                    alert("Popup blocked!");
                }
            });
        });
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Prevent popups and new tabs from ads or scripts
window.addEventListener("beforeunload", function(event) {
    if (isBlockingEnabled) {
        event.preventDefault();
        event.returnValue = "";
    }
});
