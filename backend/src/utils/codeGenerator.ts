import prisma from './prisma';

export const generateMaterialCode = async (categoryPrefix: string = 'CAT'): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const pattern = `${categoryPrefix}-${currentYear}-%`;

  // Find the last code used this year
  const lastMaterial = await prisma.material.findFirst({
    where: {
      code: { startsWith: `${categoryPrefix}-${currentYear}-` }
    },
    orderBy: { code: 'desc' },
  });

  let sequence = 1;

  if (lastMaterial) {
    const parts = lastMaterial.code.split('-');
    const lastSequence = parseInt(parts[2], 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  // Pad with zeros (e.g., 0001)
  const sequenceStr = sequence.toString().padStart(4, '0');
  return `${categoryPrefix}-${currentYear}-${sequenceStr}`;
};
