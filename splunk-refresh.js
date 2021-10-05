javascript: (() => {
    let progressBar = document.getElementById('progress-bar');
    if (progressBar === null) {
        progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.style.display = 'flex';
        progressBar.style.alignContent = 'center';
        progressBar.style.justifyContent = 'center';
        progressBar.style.color = 'white';
        progressBar.style.fontSize = '1rem';
        progressBar.style.height = '0';
        progressBar.style.overflow = 'hidden';
        progressBar.style.position = 'sticky';
        progressBar.style.top = '0';
        progressBar.style.zIndex = '10000';
        progressBar.style.width = '100%';
        progressBar.style.transition = 'all .5s ease-in-out';
        document.body.insertBefore(progressBar, document.body.firstChild);
    }

    const load_scripts = (delay, message) => new Promise(resolve => {
        progressBar.textContent = message;
        progressBar.style.backgroundColor = 'orange';
        progressBar.style.height = `${progressBar.scrollHeight}px`;
        setTimeout(resolve, delay);
    });

    const error_scripts = message => {
        progressBar.textContent = message;
        progressBar.style.backgroundColor = 'red';
        setTimeout(() => {
            progressBar.style.height = '0';
            setTimeout(() => {
                progressBar.remove();
            }, 500);
        }, 2500);
    }

    const success_scripts = message => {
        progressBar.textContent = message;
        progressBar.style.backgroundColor = 'green';
        setTimeout(() => {
            progressBar.style.height = '0';
            setTimeout(() => {
                progressBar.remove();
            }, 500);
        }, 2500);
    }

    const url = `${window.location.origin}/en-US/debug/refresh`;
    const location = window.location.origin !== 'null' ? window.location.origin : 'This';

    load_scripts(500, 'Reloading scripts...').then(
        fetch(url)
            .then(res => {
                return res.status >= 400 ? error_scripts(`${location} is not a splunk site!`) : res.text();
            })
            .then(html => {
                let parser = new DOMParser();
                let page = parser.parseFromString(html, "text/html");
                page.forms[0].submit();
                success_scripts('Scripts reloaded!');
            })
            .catch(err => {
                error_scripts(`${location} is not a splunk site!`);
            })
    );
})();