(function () {
    var Alert = {
        containerId: `alert-container-` + new Date().getTime(),
        container: null,
        options: {
            transitionDuration: 500,
            closeAfter: false
        },
        init: function () {
            if (!document.getElementById(this.containerId)) {
                this.container = document.createElement('div');
                this.container.setAttribute('id', this.containerId);
                this.container.style.cssText = `position: absolute; z-index: 100; top: 0; right: 0; margin-top: 2em; margin-right: 3em;`;
                this.container.innerHTML = '<div class="messages" style="font-size: 1.5em;"></div>';
                document.body.appendChild(this.container)
            } else {
                this.container = document.getElementById(this.containerId);
            }
            return this.add.bind(this);
        },
        add: function (message) {
            var self = this;
            var e = document.createElement('div');
            e.className = 'message';
            e.innerHTML = `
                <div style="align-self: center">${ message }</div>
                <div class="close" style="align-self: center; margin-left: 10px; padding: 5px 10px; cursor: pointer; color: #b380f0">
                    <span>OK</span>
                </div>`;
            e.style.cssText = `display: flex; justify-content: space-between; padding: 15px 20px; margin-bottom: 15px; width: 380px; background: #0a0a0a; color: #f0f0f0; border-radius: 6px; opacity: 0; transition-duration: ${this.options.transitionDuration}ms;`;
            self.container.appendChild(e);
            setTimeout(function () {
                e.style.opacity = '1';
            }, 100);

            var close = function () {
                e.style.opacity = '0';
                setTimeout(function () {
                    self.container.removeChild(e);
                }, self.options.transitionDuration);
            };

            if (self.options.closeAfter) {
                setTimeout(close, self.options.closeAfter);
            }
            e.querySelector('div.close').addEventListener('click', close);
        }
    };
    window.alert = Alert.init();
})();
