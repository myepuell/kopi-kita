// Kunci penandatangan token admin. Wajib diisi lewat env JWT_SECRET (Vercel / .env lokal).
// Sengaja tanpa nilai cadangan: nilai cadangan lama tertulis di repo publik, jadi siapa pun
// bisa membuat token admin palsu kalau env lupa diisi. Tanpa kunci yang layak, login admin ditolak.
const PUBLIC_OLD_SECRET = 'super_secret_kopi_kita_jwt_key_2026';
const MIN_LENGTH = 32;

export function getJwtSecret(): string | null {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < MIN_LENGTH || secret === PUBLIC_OLD_SECRET) {
    console.error(
      `JWT_SECRET belum diisi, kurang dari ${MIN_LENGTH} karakter, atau masih nilai lama yang publik. ` +
        'Login admin dinonaktifkan. Buat yang baru: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
    return null;
  }
  return secret;
}
