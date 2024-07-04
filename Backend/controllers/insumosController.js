let insumos = [
  { id: 1, nombre: 'Harina (g)' },
  { id: 2, nombre: 'Sal (g)' },
  { id: 3, nombre: 'Huevo (ud)' },
  { id: 4, nombre: 'Azucar (g)' },
  { id: 5, nombre: 'Polvo de hornear (g)' },
  { id: 6, nombre: 'Leche (ml)' },
  { id: 7, nombre: 'Agua (ml)' },
  { id: 8, nombre: 'Queso (g)' },
  { id: 9, nombre: 'Aceite (ml)' },
  { id: 10, nombre: 'Harina integral (6)' }
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
