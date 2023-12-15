function convertToCSV(objectArray: any[]) {
    const array = [Object.keys(objectArray[0])].concat(objectArray);

    return array
        .map((object) => {
            const values = Object.values(object);

            const row = values.map((value) =>
                value.toString().includes(",") ? '"' + value + '"' : value
            );

            return row.join(",");
        })
        .join("\n");
}

export {convertToCSV};
