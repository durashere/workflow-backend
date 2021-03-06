import Template from '../models/template.model';

export const getAllTemplates = async (req, res) => {
  const templates = await Template.find().sort({ name: 1 });

  return res.status(200).json({
    results: templates.length,
    templates,
  });
};

export const createTemplate = async (req, res) => {
  const newTemplate = await Template.create(req.body);

  return res.status(201).json({
    template: newTemplate,
  });
};
