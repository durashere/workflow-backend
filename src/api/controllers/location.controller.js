import Location from '../models/location.model';

export const getAllLocations = async (req, res) => {
  const queryObj = req.query;
  const locations = await Location.find(queryObj).sort({ name: 1 });

  return res.status(200).json({
    results: locations.length,
    locations,
  });
};

export const getLocation = async (req, res) => {
  const location = await Location.findById(req.params.id);

  return res.status(200).json({
    location,
  });
};

export const createLocation = async (req, res) => {
  const newLocation = await Location.create(req.body);

  return res.status(201).json({
    location: newLocation,
  });
};

export const updateLocation = async (req, res) => {
  const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    location,
  });
};
