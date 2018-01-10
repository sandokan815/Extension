function q() {
	chrome.browserAction.onClicked.addListener(function() {
		var a = "window.html",
			b = !0,
			e = 870,
			c = 670;
		a = b ? chrome.runtime.getURL(a) : a;
		chrome.tabs.query({
			url: a
		}, function(b) {
			if (b && 0 < b.length) chrome.windows.update(b[0].windowId, {
				focused: !0
			});
			else {
				var d = window.devicePixelRatio || 1;
				b = screen.width;
				var f = screen.height - 70,
					l = parseInt(c * d),
					d = parseInt(e * d),
					g = parseInt((b - d) / 2),
					h = parseInt((f - l) / 2);
				d > b && (d = b, g = 0);
				l > f && (l = f, h = 0);
				0 > g && (g = 0);
				0 > h && (h = 0);
				chrome.windows.create({
					type: "popup",
					focused: !0,
					url: a,
					top: h,
					left: g,
					width: d,
					height: l,
				})
			}
		});
	});
}


var f = Date.now();

document.cookie && -1 < document.cookie.indexOf("s=7") ? (f = parseInt(localStorage.st), q()) : (document.cookie = "s=7; expires=0; path=/", localStorage.st = f, q())