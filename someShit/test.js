const JSONToFile = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
};
let readData;

async function fetchJSONData() {
    readData = await fetch("./text.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error)
        });
}


//вызываем мейн функцию через кнопку на сайте, для скачивания используем JSONToFile, чтение не омобо актуально если я правильно понимаю, заменяем readData на имя нужного объекта и после двух нажатий на кнопку, скачается нужный файл
function main() {
    fetchJSONData();
    console.log(readData);
    JSONToFile(readData, 'testJsonFile');
}

