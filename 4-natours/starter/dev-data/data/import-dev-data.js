

const fs = require('fs');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')

dotenv.config({ path: '../../config.env' })



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));
// read JSON file
const tours = JSON.parse(fs.readFileSync('../data/tours-simple.json', 'utf-8'));

// import data into database
const importData = async () => {
    try {
        await Tour.create(tours)
        process.exit()
        console.log('Data successfully loaded!')
    } catch (err) {
        console.log(err)
    }
}
// Delete all data from collection
const deleteData = async() => {
    try {
        await Tour.deleteMany()
        console.log('Data successfully deleted!')
        process.exit();
    } catch (err) {
        console.log(err)
    }
}


if(process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData()
}


console.log(process.argv)