const baseUrl = "https://veron-api.azure-api.net"
//const baseUrl = 'https://veron-library.azurewebsites.net';
//const baseUrl = 'http://localhost:47078';

document.getElementById("addBookBtn").onclick = function(e) {
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');

    formData.append('author', document.querySelector('input[id="author"]').value);
    formData.append('title', document.querySelector('input[id="title"]').value);
    formData.append('book', fileField.files[0]);

    fetch(baseUrl + '/api/book', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
        .then(result => {
            fetchBooks();

            let myModalEl = document.querySelector('#exampleModal');
            let modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();
            document.getElementById("form").reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });

    return false;
}

let bookTab = document.querySelector('button[data-bs-target="#pills-books"]');
bookTab.addEventListener('shown.bs.tab', function (event) {
    fetchBooks();
});

let auditTab = document.querySelector('button[data-bs-target="#pills-audit"]');
auditTab.addEventListener('shown.bs.tab', function (event) {
    fetchAudit();
});

function fetchBooks() {
    fetch(baseUrl + '/api/book', {
        headers: {
            "Authorization": "f6dc69a089844cf6b2019bae6d36fac8"
        }
    })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('booksTable');

            clearTable(table);

            for (const user of data) {
                let row = table.insertRow(-1);
                let newCell = row.insertCell(0);
                let newText = document.createTextNode(user.author);
                newCell.appendChild(newText);

                newCell = row.insertCell(1);
                newText = document.createTextNode(user.title);
                newCell.appendChild(newText);

                newCell = row.insertCell(2);
                let anchor = document.createElement('a');
                anchor.href = user.link;
                newText = document.createTextNode('Download');
                anchor.appendChild(newText);
                newCell.appendChild(anchor);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchAudit() {
    fetch(baseUrl + '/api/audit')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('auditTable');

            clearTable(table);

            for (const audit of data) {
                let row = table.insertRow(-1);
                let newCell = row.insertCell(0);
                let newText = document.createTextNode(audit.id);
                newCell.appendChild(newText);

                newCell = row.insertCell(1);
                newText = document.createTextNode(audit.timeStamp);
                newCell.appendChild(newText);

                newCell = row.insertCell(2);
                newText = document.createTextNode(audit.name);
                newCell.appendChild(newText);

                newCell = row.insertCell(3);
                newText = document.createTextNode(audit.url);
                newCell.appendChild(newText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function clearTable(table) {
    let tableHeaderRowCount = 1;
    let rowCount = table.rows.length;
    for (let i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

fetchBooks();