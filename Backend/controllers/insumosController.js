let insumos = [
  { id: 1, nombre: 'Harina' },
  { id: 2, nombre: 'Sal' },
  { id: 3, nombre: 'Huevo' },
  { id: 4, nombre: 'Azucar' },
  { id: 5, nombre: 'Polvo de hornear' },
  { id: 6, nombre: 'Leche' },
  { id: 7, nombre: 'Agua' },
  { id: 8, nombre: 'Queso' },
  { id: 9, nombre: 'Aceite' },
  { id: 10, nombre: 'Harina integral' }
];

exports.insumos = insumos;

exports.getInsumos = (req, res) => {
  res.json(insumos);
};

exports.getInsumoById = (req, res) => {
  const { id } = req.params;
  const insumo = insumos.find(i => i.id == id);
  if (insumo) {
    res.json(insumo);
  } else {
    res.status(404).json({ message: 'Insumo no encontrado' });
  }
};

exports.obtenerinsumoById = async (id) => {
  return new Promise((resolve, reject) => {
    const insumo = insumos.find(i => i.id == id);
    if (insumo) {
      resolve(insumo);
    } else {
      reject(new Error('Insumo no encontrado'));
    }
  });
};

exports.createInsumo = (req, res) => {
  const newInsumo = req.body;
  newInsumo.id = insumos.length ? insumos[insumos.length - 1].id + 1 : 1;
  insumos.push(newInsumo);
  res.status(201).json(newInsumo);
};

exports.updateInsumo = (req, res) => {
  const { id } = req.params;
  const updatedInsumo = req.body;
  const insumoIndex = insumos.findIndex(i => i.id == id);
  if (insumoIndex !== -1) {
    insumos[insumoIndex] = { ...insumos[insumoIndex], ...updatedInsumo };
    res.json(insumos[insumoIndex]);
  } else {
    res.status(404).json({ message: 'Insumo no encontrado' });
  }
};

exports.deleteInsumo = (req, res) => {
  const { id } = req.params;
  const insumoIndex = insumos.findIndex(i => i.id == id);
  if (insumoIndex !== -1) {
    const deletedInsumo = insumos.splice(insumoIndex, 1);
    res.json(deletedInsumo);
  } else {
    res.status(404).json({ message: 'Insumo no encontrado' });
  }
};
