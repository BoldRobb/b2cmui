
export interface RegimenFiscalType {
  clave: string;
  descripcion: string;
  personaFisica: boolean;
  personaMoral: boolean;
}


export const RegimenFiscal: Record<string, RegimenFiscalType> = {
  RF_601: { clave: "601", descripcion: "General de Ley Personas Morales", personaFisica: false, personaMoral: true },
  RF_603: { clave: "603", descripcion: "Personas Morales con Fines no Lucrativos", personaFisica: false, personaMoral: true },
  RF_605: { clave: "605", descripcion: "Sueldos y Salarios e Ingresos Asimilados a Salarios", personaFisica: true, personaMoral: false },
  RF_606: { clave: "606", descripcion: "Arrendamiento", personaFisica: true, personaMoral: false },
  RF_607: { clave: "607", descripcion: "Régimen de Enajenación o Adquisición de Bienes", personaFisica: true, personaMoral: false },
  RF_608: { clave: "608", descripcion: "Demás ingresos", personaFisica: true, personaMoral: false },
  RF_610: { clave: "610", descripcion: "Residentes en el Extranjero sin Establecimiento Permanente en México", personaFisica: true, personaMoral: true },
  RF_611: { clave: "611", descripcion: "Ingresos por Dividendos (socios y accionistas)", personaFisica: true, personaMoral: false },
  RF_612: { clave: "612", descripcion: "Personas Físicas con Actividades Empresariales y Profesionales", personaFisica: true, personaMoral: false },
  RF_614: { clave: "614", descripcion: "Ingresos por intereses", personaFisica: true, personaMoral: false },
  RF_615: { clave: "615", descripcion: "Régimen de los ingresos por obtención de premios", personaFisica: true, personaMoral: false },
  RF_616: { clave: "616", descripcion: "Sin obligaciones fiscales", personaFisica: true, personaMoral: false },
  RF_620: { clave: "620", descripcion: "Sociedades Cooperativas de Producción que optan por diferir sus ingresos", personaFisica: false, personaMoral: true },
  RF_621: { clave: "621", descripcion: "Incorporación Fiscal", personaFisica: true, personaMoral: false },
  RF_622: { clave: "622", descripcion: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras", personaFisica: false, personaMoral: true },
  RF_623: { clave: "623", descripcion: "Opcional para Grupos de Sociedades", personaFisica: false, personaMoral: true },
  RF_624: { clave: "624", descripcion: "Coordinados", personaFisica: false, personaMoral: true },
  RF_625: { clave: "625", descripcion: "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas", personaFisica: true, personaMoral: false },
  RF_626: { clave: "626", descripcion: "Régimen Simplificado de Confianza", personaFisica: true, personaMoral: true },
};


export interface UsoCFDIType {
  clave: string;
  descripcion: string;
  personaFisica: boolean;
  personaMoral: boolean;
}


export const UsoCFDI: Record<string, UsoCFDIType> = {
  G01: { clave: "G01", descripcion: "Adquisición de mercancías", personaFisica: true, personaMoral: true },
  G02: { clave: "G02", descripcion: "Devoluciones, descuentos o bonificaciones", personaFisica: true, personaMoral: true },
  G03: { clave: "G03", descripcion: "Gastos en general", personaFisica: true, personaMoral: true },
  I01: { clave: "I01", descripcion: "Construcciones", personaFisica: true, personaMoral: true },
  I02: { clave: "I02", descripcion: "Mobiliario y equipo de oficina por inversiones", personaFisica: true, personaMoral: true },
  I03: { clave: "I03", descripcion: "Equipo de transporte", personaFisica: true, personaMoral: true },
  I04: { clave: "I04", descripcion: "Equipo de computo y accesorios", personaFisica: true, personaMoral: true },
  I05: { clave: "I05", descripcion: "Dados, troqueles, moldes, matrices y herramental", personaFisica: true, personaMoral: true },
  I06: { clave: "I06", descripcion: "Comunicaciones telefónicas", personaFisica: true, personaMoral: true },
  I07: { clave: "I07", descripcion: "Comunicaciones satelitales", personaFisica: true, personaMoral: true },
  I08: { clave: "I08", descripcion: "Otra maquinaria y equipo", personaFisica: true, personaMoral: true },
  D01: { clave: "D01", descripcion: "Honorarios médicos, dentales y gastos hospitalarios", personaFisica: true, personaMoral: false },
  D02: { clave: "D02", descripcion: "Gastos médicos por incapacidad o discapacidad", personaFisica: true, personaMoral: false },
  D03: { clave: "D03", descripcion: "Gastos funerales", personaFisica: true, personaMoral: false },
  D04: { clave: "D04", descripcion: "Donativos", personaFisica: true, personaMoral: false },
  D05: { clave: "D05", descripcion: "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)", personaFisica: true, personaMoral: false },
  D06: { clave: "D06", descripcion: "Aportaciones voluntarias al SAR", personaFisica: true, personaMoral: false },
  D07: { clave: "D07", descripcion: "Primas por seguros de gastos médicos", personaFisica: true, personaMoral: false },
  D08: { clave: "D08", descripcion: "Gastos de transportación escolar obligatoria", personaFisica: true, personaMoral: false },
  D09: { clave: "D09", descripcion: "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones", personaFisica: true, personaMoral: false },
  D10: { clave: "D10", descripcion: "Pagos por servicios educativos (colegiaturas)", personaFisica: true, personaMoral: false },
  S01: { clave: "S01", descripcion: "Sin efectos fiscales", personaFisica: true, personaMoral: true },
  CP01: { clave: "CP01", descripcion: "Pagos", personaFisica: true, personaMoral: true },
  CN01: { clave: "CN01", descripcion: "Nómina", personaFisica: true, personaMoral: false },
};


export interface FormaPagoType {
  clave: string;
  descripcion: string;
}


export const FormaPago: Record<string, FormaPagoType> = {
  FP_01: { clave: "01", descripcion: "Efectivo" },
  FP_02: { clave: "02", descripcion: "Cheque nominativo" },
  FP_03: { clave: "03", descripcion: "Transferencia electrónica de fondos" },
  FP_04: { clave: "04", descripcion: "Tarjeta de crédito" },
  FP_05: { clave: "05", descripcion: "Monedero electrónico" },
  FP_06: { clave: "06", descripcion: "Dinero electrónico" },
  FP_08: { clave: "08", descripcion: "Vales de despensa" },
  FP_12: { clave: "12", descripcion: "Dación en pago" },
  FP_13: { clave: "13", descripcion: "Pago por subrogación" },
  FP_14: { clave: "14", descripcion: "Pago por consignación" },
  FP_15: { clave: "15", descripcion: "Condonación" },
  FP_17: { clave: "17", descripcion: "Compensación" },
  FP_23: { clave: "23", descripcion: "Novación" },
  FP_24: { clave: "24", descripcion: "Confusión" },
  FP_25: { clave: "25", descripcion: "Remisión de deuda" },
  FP_26: { clave: "26", descripcion: "Prescripción o caducidad" },
  FP_27: { clave: "27", descripcion: "A satisfacción del acreedor" },
  FP_28: { clave: "28", descripcion: "Tarjeta de débito" },
  FP_29: { clave: "29", descripcion: "Tarjeta de servicios" },
  FP_30: { clave: "30", descripcion: "Aplicación de anticipos" },
  FP_31: { clave: "31", descripcion: "Intermediario pagos" },
  FP_99: { clave: "99", descripcion: "Por definir" },
};


export const getRegimenFiscalOptions = (): { value: string; label: string }[] => {
  return Object.values(RegimenFiscal).map(regimen => ({
    value: regimen.clave,
    label: `${regimen.clave} - ${regimen.descripcion}`
  }));
};

export const getUsoCFDIOptions = (): { value: string; label: string }[] => {
  return Object.values(UsoCFDI).map(uso => ({
    value: uso.clave,
    label: `${uso.clave} - ${uso.descripcion}`
  }));
};

export const getFormaPagoOptions = (): { value: string; label: string }[] => {
  return Object.values(FormaPago).map(forma => ({
    value: forma.clave,
    label: `${forma.clave} - ${forma.descripcion}`
  }));
};


export const getRegimenFiscalByTipo = (esPersonaFisica: boolean): { value: string; label: string }[] => {
  return Object.values(RegimenFiscal)
    .filter(regimen => esPersonaFisica ? regimen.personaFisica : regimen.personaMoral)
    .map(regimen => ({
      value: regimen.clave,
      label: `${regimen.clave} - ${regimen.descripcion}`
    }));
};

export const getUsoCFDIByTipo = (esPersonaFisica: boolean): { value: string; label: string }[] => {
  return Object.values(UsoCFDI)
    .filter(uso => esPersonaFisica ? uso.personaFisica : uso.personaMoral)
    .map(uso => ({
      value: uso.clave,
      label: `${uso.clave} - ${uso.descripcion}`
    }));
};


export const getRegimenFiscalDescripcion = (clave: string): string => {
  const regimen = Object.values(RegimenFiscal).find(r => r.clave === clave);
  return regimen ? regimen.descripcion : 'No encontrado';
};

export const getUsoCFDIDescripcion = (clave: string): string => {
  const uso = Object.values(UsoCFDI).find(u => u.clave === clave);
  return uso ? uso.descripcion : 'No encontrado';
};

export const getFormaPagoDescripcion = (clave: string): string => {
  const forma = Object.values(FormaPago).find(f => f.clave === clave);
  return forma ? forma.descripcion : 'No encontrado';
};