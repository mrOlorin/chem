export const j = 1.602176634e-19; // Джоуль, эВ
export const kg = 1.782662e-36; // Килограмм, эВ

export const α = 7.2973525693e-3; // Простоянная тонкой структуры
export const c = 299792458; // Скорость света, м/с
export const µ0 = 1.25663706212e-6; // Магнитная постоянная, Н · (А⁻²)
// export const ε0 = 1 / (µ0 * (c²));
export const ε0 = 8.85418781762039e-12;  // Электрическая постоянная, диэлектрическая проницаемость вакуума, м⁻³·кг⁻¹·с⁴·А²

export const e = 1.602176634e-19; // Элементарный заряд, Кл

export const h = 4.135667696e-15;  // Постоянная Планка, эВ/c
export const hj = h * e;  // Постоянная Планка, Дж/c

export const ħ = h / (2 * Math.PI); // Приведённая постоянная Планка, эВ/c
export const ħj = ħ * e; // Приведённая постоянная Планка, Дж/с

export const R = 10973731.5; // Константа Ридберга (эксп.), м⁻¹
export const a0 = 5.29177210903e-11; // Боровский радиус, м

export const G = 6.67430e-11; // м³·кг⁻¹·с⁻²

export const FOUR_PI_ε0 = 4 * Math.PI * ε0;
export const MAGNETIC_MOMENT: { proton: number, neutron: number } = {
  proton: 2.79284734463,
  neutron: -1.91304273
};
