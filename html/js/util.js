

/**
 * add new data to a chart
 * @param {*} chart chart object of chart.js
 * @param {*} label time or index
 * @param {*} data 
 * 
 * e.g.
 * data = {"x":1, "y":2}
 */
function addData(chart, label, data) {
    chart.data.labels.push(label)
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data)
    })
    chart.update()
}

/**
 * add values to a chart
 * @param {*} chart 
 * @param {*} data 
 */
function addValue(chart, data, count) {
    if (count == 0) {
        //init plot
        chart.data.labels = []
        chart.data.datasets = []
    }
    // count += 1
    chart.data.labels.push(count) // add x-value

    // assign labels to a list
    data_labels = []
    chart.data.datasets.forEach((dataset) =>
        data_labels.push(dataset.label),
    )

    let has_new_dataset = false
    for (let key in data) {
        if ((typeof data[key]) == "object") {
            // nested
            for (let k in data[key]) {
                addValueWithKey(chart, data[key], k, `${key}-${k}`)
            }
        } else {
            addValueWithKey(chart, data, key)
        }
    }

    if (chart.data.labels.length > main_app.max_length) {
        shiftData(chart)
    }
    if (has_new_dataset) {
        // has no effect
        chart.clear()
    }
    chart.update()
}

function addValueWithKey(chart, data, key, label = key) {
    let i = data_labels.findIndex((element) => element == label)
    if (i > -1) {
        // chart already has a data with the key
        chart.data.datasets[i].data.push(data[key])
    } else {
        // chart have no data with the key yet
        // get a index of color for new key
        let j = chart.data.datasets.length % main_app.color_palette.length
        // create new dataset
        new_dataset = {
            label: label,
            data: [data[key]],
            borderColor: main_app.color_palette[j],
        }
        chart.data.datasets.push(new_dataset)
        has_new_dataset = true
    }
}


function shiftData(chart) {
    chart.data.labels.shift()
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift()
    })
}
