(function(document, alert) {
    var form = document.querySelector('#uploader form');
    var table = document.querySelector('#data');
    var googleTranslate = document.querySelector('.google-translate-container');
    var downloadButton = document.querySelector('#download');
    var downloadContainer = document.querySelector('.download-container');
    var note = document.querySelector('#note');

    var addScriptToPage = function (url) {
        var s = document.createElement('script');
        s.src = url;
        document.head.appendChild(s);
    };



    var moveToTable = function (filename, data) {
        var tbody = table.querySelector('tbody');
        var rowsWithVariables = [];
        tbody.innerHTML = '';
        data.forEach(function (item) {
            var row = document.createElement('tr');
            var fromCol = document.createElement('td');
            var toCol = document.createElement('td');
            fromCol.innerText = item;
            toCol.innerText = item;
            fromCol.className = 'from-col notranslate';
            toCol.className = 'to-col';
            toCol.contentEditable = "true";
            if (item.indexOf('%s') > -1) {
                toCol.className += ' notranslate';
                row.className = 'with-variable';
            } else {
                row.className = 'without-variable';
            }
            row.appendChild(fromCol);
            row.appendChild(toCol);

            if (row.className.indexOf('with-variable') > -1) {
                rowsWithVariables.push(row);
            } else {
                tbody.appendChild(row);
            }
        });

        rowsWithVariables.forEach(function (row) {
            tbody.appendChild(row);
        });

        if (rowsWithVariables.length) {
            alert(`${rowsWithVariables.length} rows have variables in them and hence cannot be translated. They have been marked red. You will have to do them manually`);
        }

        googleTranslateElementInit();

        googleTranslate.style.display = 'block';
        downloadContainer.style.display = 'block';
        note.style.display = 'block';
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var reader = new FileReader();
        if (!this.querySelector('[name="file"]').files.length) return;
        var theFile = this.querySelector('[name="file"]').files[0];
        if (theFile.type === 'application/json') {
            reader.onload = function(e) {
                moveToTable(theFile.name, Object.keys(JSON.parse(e.target.result)));
            };
        } else if (theFile.type === 'text/csv') {
            reader.onload = function(e) {
                var data = Papa.parse(e.target.result).data.map(function (row) {
                    return row[0];
                }).filter(function (item) {
                    return item;
                });
                moveToTable(theFile.name, data);
            };
        } else {
            alert(`Type "${theFile.type}" not supported`);
        }
        reader.readAsBinaryString(theFile);
    });

    downloadButton.addEventListener('click', function (e) {
        e.preventDefault();
        var data = {};
        table.querySelectorAll('tbody tr.without-variable').forEach(function (row) {
            data[row.querySelector('.from-col').innerText] = row.querySelector('.to-col').innerText;
        });

        table.querySelectorAll('tbody tr.with-variable').forEach(function (row) {
            data[row.querySelector('.from-col').innerText] = row.querySelector('.to-col').innerText;
        });

        // if (table.querySelectorAll('tbody tr.with-variable').length) {
        //     alert(`${table.querySelectorAll('tbody tr.with-variable').length} rows were not translated because they have variables. Please do them manually.`);
        // }

        let j = document.createElement("a")
        j.id = "download"
        j.download = "translated_"+Date.now()+".json"
        j.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)]));
        j.click()

    });

    var googleTranslateElementInit = function () {
        new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
    }

    addScriptToPage('https://translate.google.com/translate_a/element.js');
    addScriptToPage('./assets/script/papaparse.min.js');

})(window.document, window.alert);
