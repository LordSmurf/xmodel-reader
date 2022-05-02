var holder = document.getElementById("holder"),
	state = document.getElementById("status"),
	contentHolder = document.getElementById("content-holder"),
	buttonClear = document.querySelector(".clear"),
	techsets = [];

if (typeof window.FileReader === "undefined") {
	state.className = "fail";
} else {
	state.className = "success";
	state.innerHTML = "File API & FileReader available";
}

buttonClear.addEventListener("click", () => {
	contentHolder.innerHTML = "";
});

function readFileAsText(file) {
	return new Promise(function (resolve, reject) {
		let reader = new FileReader();

		reader.onload = function () {
			resolve(reader.result);
		};

		reader.onerror = function () {
			reject(reader);
		};

		techsets.push(file.name);
		reader.readAsText(file);
	});
}

holder.ondragover = function () {
	this.className = "hover";
	return false;
};
holder.ondragend = function () {
	this.className = "";
	return false;
};
holder.ondrop = function (e) {
	this.className = "";
	e.preventDefault();

	const files = [...e.dataTransfer.files];
	let readers = [];
	console.time("Reader");

	for (let i = 0; i < files.length; i++) {
		readers.push(readFileAsText(files[i]));
	}

	Promise.all(readers).then((values) => {
		values.forEach((f, index) => {
			let item = document.createElement("pre");
			item.classList.add("file");
			if (f.includes("NUMBONES")) {
				techsets.forEach((techset, idx) => {
					if (index == idx) {
						start = f.search(/(NUMBONES)/g);
						let bones = f.match(/BONE .*"/g);
						item.innerText = `Model: ${techset.replace(
							/(_LOD0.xmodel_export)/gi,
							""
						)}\nBone Count: ${f.substring(start + 9, start + 12)}\n\nBones:\n${
							bones.length != 0 ? bones.join("\n") : "No bones detected"
						}`;
						contentHolder.appendChild(item);
					}
				});
			}
		});
		console.timeEnd("Reader");
	});

	return false;
};
