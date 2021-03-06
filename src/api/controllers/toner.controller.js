import Printer from '../models/printer.model';
import Toner from '../models/toner.model';

export const getAllToners = async (req, res) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(
    /\b(gte)|(gt)|(lte)|(lt)\b/g,
    (match) => `$${match}`
  );

  let query = Toner.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const toners = await query;

  return res.status(200).json({
    results: toners.length,
    toners,
  });
};

export const getAllUncategorized = async (req, res) => {
  const categorizedToners = await Printer.find({}, { _id: false }).select(
    'toners'
  );
  const arrays = categorizedToners.map((toner) => toner.toners);
  const flattedToners = arrays.flat();

  const finalToners = await Toner.find({
    _id: { $nin: flattedToners },
  });

  return res.status(200).json({
    results: finalToners.length,
    toners: finalToners,
  });
};

export const getToner = async (req, res) => {
  const toner = await Toner.findById(req.params.id);

  return res.status(200).json({
    toner,
  });
};

export const createToner = async (req, res) => {
  const newToner = await Toner.create(req.body);

  return res.status(201).json({
    toner: newToner,
  });
};

export const updateToner = async (req, res) => {
  if (req.body.amount < 0) {
    return res.status(403).json({
      message: "Amount can't be negative.",
    });
  }

  const toner = await Toner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    toner,
  });
};

export const deleteToner = async (req, res) => {
  await Toner.findByIdAndDelete(req.params.id);

  // Delete tonerId from printer
  await Printer.updateMany(
    {},
    {
      $pull: {
        toners: req.params.id,
      },
    }
  );

  return res.status(204).json();
};
