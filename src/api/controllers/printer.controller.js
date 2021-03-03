import Printer from '../models/printer.model';

export const getAllPrinters = async (req, res) => {
  // Query Printer
  const queryObjPrinter = {};
  if (req.query.brand) {
    queryObjPrinter.brand = req.query.brand;
  }
  if (req.query.model) {
    queryObjPrinter.model = req.query.model;
  }

  // Query Toner
  const queryObjToner = {};
  if (req.query.amount) {
    queryObjToner.amount = req.query.amount;
  }
  if (req.query.code) {
    queryObjToner.code = req.query.code;
  }
  if (req.query.color) {
    queryObjToner.color = req.query.color;
  }

  const printers = await Printer.find(queryObjPrinter).populate({
    path: 'toners',
    match: queryObjToner,
  });

  return res.status(200).json({
    results: printers.length,
    printers,
  });
};

export const getPrinter = async (req, res) => {
  const printer = await Printer.findById(req.params.id).populate('toners');

  return res.status(200).json({
    printer,
  });
};

export const createPrinter = async (req, res) => {
  const newPrinter = await Printer.create(req.body);

  return res.status(201).json({
    printer: newPrinter,
  });
};

export const updatePrinter = async (req, res) => {
  const printer = await Printer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    printer,
  });
};

export const deletePrinter = async (req, res) => {
  await Printer.findByIdAndDelete(req.params.id);

  return res.status(204).json();
};
