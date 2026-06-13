import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/university_whatsapp';

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone:    { type: String, required: true, unique: true, trim: true },
  code:     { type: String, required: true, unique: true, trim: true },
  faculty:  { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1, max: 12 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

const students = [
  // Ingeniería de Software
  { fullName: 'Andrés Felipe Torres Gómez',    code: '1020481234', phone: '3101234567', faculty: 'Ingenieria de software',  semester: 3,  active: true  },
  { fullName: 'Valentina Ríos Herrera',         code: '1023456789', phone: '3112345678', faculty: 'Ingenieria de software',  semester: 5,  active: true  },
  { fullName: 'Sebastián Morales Pineda',       code: '1018765432', phone: '3123456789', faculty: 'Ingenieria de software',  semester: 7,  active: false },
  // Diseño Gráfico
  { fullName: 'Camila Estrada Vargas',          code: '1026543210', phone: '3134567890', faculty: 'Diseño grafico',          semester: 2,  active: true  },
  { fullName: 'Juan Pablo Ospina Ruiz',         code: '1021987654', phone: '3145678901', faculty: 'Diseño grafico',          semester: 4,  active: true  },
  { fullName: 'Daniela Castro Mejía',           code: '1024321098', phone: '3156789012', faculty: 'Diseño grafico',          semester: 6,  active: true  },
  // Finanzas y Comercio
  { fullName: 'Miguel Ángel Reyes Salazar',     code: '1019876543', phone: '3167890123', faculty: 'Finanzas y comercio',     semester: 1,  active: true  },
  { fullName: 'Laura Sofía Mendoza Arias',      code: '1027654321', phone: '3178901234', faculty: 'Finanzas y comercio',     semester: 4,  active: false },
  { fullName: 'Carlos Andrés Jiménez Rojas',    code: '1022109876', phone: '3189012345', faculty: 'Finanzas y comercio',     semester: 8,  active: true  },
  // Diseño de Modas
  { fullName: 'Isabella Ramírez Córdoba',       code: '1025432109', phone: '3190123456', faculty: 'Diseño de modas',         semester: 2,  active: true  },
  { fullName: 'Manuela Pedraza Lozano',         code: '1028765432', phone: '3201234567', faculty: 'Diseño de modas',         semester: 5,  active: true  },
  { fullName: 'Santiago Guerrero Blanco',       code: '1017654321', phone: '3212345678', faculty: 'Diseño de modas',         semester: 3,  active: false },
  // Hotelería y Turismo
  { fullName: 'Natalia Bermúdez Aguilar',       code: '1029876543', phone: '3223456789', faculty: 'Hoteleria y turismo',     semester: 1,  active: true  },
  { fullName: 'Esteban Molina Cifuentes',       code: '1016543210', phone: '3234567890', faculty: 'Hoteleria y turismo',     semester: 6,  active: true  },
  { fullName: 'Alejandra Suárez Montoya',       code: '1030123456', phone: '3245678901', faculty: 'Hoteleria y turismo',     semester: 9,  active: true  },
];

async function seedStudents() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

  let creados = 0;
  let omitidos = 0;

  for (const s of students) {
    const exists = await Student.findOne({ code: s.code });
    if (exists) {
      console.log(`  Omitido (ya existe): ${s.fullName}`);
      omitidos++;
      continue;
    }
    await Student.create(s);
    console.log(`  Creado: ${s.fullName} — ${s.faculty}`);
    creados++;
  }

  console.log(`\nListo. ${creados} estudiantes creados, ${omitidos} omitidos.`);
  await mongoose.disconnect();
}

seedStudents().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});