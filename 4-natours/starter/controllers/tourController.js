

const Tour = require('../models/tourModel');


exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};



exports.getAllTours = async (req, res) => {
    try {
      // 1.A) Filtering
      const queryObj = { ...req.query };
      const excludedFields = ['sort', 'limit', 'duration', 'page', 'fields'];
      excludedFields.forEach(field => delete queryObj[field]);
   
      // 1.B) Advance Filtering
      let queryString = JSON.stringify(queryObj);
      queryString = queryString.replace(
        /\b(lte|gte|gt|lt)\b/g,
        match => `$${match}`
      );
   
      let query = Tour.find(JSON.parse(queryString));
   
      // 2) Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
          query = query.sort('-createdAt')
      }
      // else {
      //   query = query.sort('-createdAt');
      // }
   
      if (req.query.fields) {
          const fields = req.query.fields.split(',').join(' ')
          query = query.select(fields)
      } else {
          query = query.select('-__v')
      }
    //   pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit)

      if (req.query.page) {
          const numTours = await Tour.countDocuments();
          if(skip >= numTours) throw new Error('This page does not exist')
      }

      // Execute Query
      const tours = await query;



        // const query = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy')

        res.status(200).json({ 
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}
exports.getTour = async(req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ _id: req.params.id })
        res.status(200).json({
            status: 'success',
            data: {
              tour
            }
          });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
  };

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()
    const newTour = await Tour.create(req.body)
    res.status(201).json({status: 'Success',
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent'
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200)
        .json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent'
        })
    }
    
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(404)
        .json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent'
        })
    }
}
