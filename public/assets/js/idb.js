let db;
const request = indexedDB.open('letters', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('Move', { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    MoveUpload();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const Move = db.transaction(['Move'], 'readwrite');

  const MoveObjectStore = Move.objectStore('Move');

  MoveObjectStore.add(record);
}

function MoveUpload() {
  const Move = db.transaction(['Move'], 'readwrite');

  const MoveObjectStore = Move.objectStore('Move');

  const getAll = MoveObjectStore.getAll();

	getAll.onsuccess = function() {
			if (getAll.result.length > 0) {
				fetch('/api/Move', {
					method: 'POST',
					body: JSON.stringify(getAll.result),
					headers: {
						Accept: 'application/json, text/plain, */*',
						'Content-Type': 'application/json'
					}
				})
					.then(response => response.json())
					.then(serverResponse => {
						if (serverResponse.message) {
							throw new Error(serverResponse);
						}
						const Move = db.transaction(['Move'], 'readwrite');
						const MoveObjectStore = Move.objectStore('Move');
						MoveObjectStore.clear();

						alert('All saved Moves have been submitted!');
					})
					.catch(err => {
						console.log(err);
					});
			}
		};
}

window.addEventListener('online', MoveUpload);