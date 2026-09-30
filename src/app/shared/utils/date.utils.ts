export function formatearFechaInput(fecha: string): string {
  return fecha ? fecha.split('T')[0] : '';
}
