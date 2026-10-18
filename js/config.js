/*
 * Conexión con Supabase. La clave publicable es pública por diseño: solo permite
 * LEER el contenido. Todas las modificaciones pasan por la Edge Function "booz-admin",
 * que comprueba la contraseña MASTER en el servidor.
 */
window.BOOZ_CONFIG = {
  supabaseUrl: "https://klmjmlhwuzhymrplemgw.supabase.co",
  supabaseKey: "sb_publishable_DSS-WHn-WawxfYe0RWUHRg_odMjrb_b",
  funcionAdmin: "booz-admin"
};
