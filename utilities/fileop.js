const fs = require('fs')

const readFromFile = (path) => {
    try {
        const data = fs.readFileSync(path, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        return []
    }
}

const writeIntoFile = (path, content) => {
    try {
        fs.writeFileSync(path, JSON.stringify(content), 'utf-8')
    } catch (err) {
        console.log('something went wrong')
    }
}

module.exports = { readFromFile, writeIntoFile }
