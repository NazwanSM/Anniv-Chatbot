# Audio Files untuk Anniversary Message

## Instruksi

Untuk mengaktifkan fitur audio player di halaman anniversary, silakan letakkan file audio ucapan anniversary Anda di folder ini dengan nama:

- `anniversary-message.mp3` (format MP3, direkomendasikan)
- atau `anniversary-message.wav` (format WAV)

## Cara Membuat File Audio

Ada beberapa cara untuk membuat file audio ucapan:

### 1. Rekaman Manual
- Gunakan aplikasi perekam suara di ponsel atau komputer
- Rekam ucapan anniversary Anda
- Export dalam format MP3 atau WAV
- Rename file menjadi `anniversary-message.mp3`
- Copy file ke folder `public/audio/`

### 2. Text-to-Speech (TTS)
Jika ingin menggunakan AI voice generator, Anda bisa gunakan layanan seperti:
- **ElevenLabs** (https://elevenlabs.io) - Kualitas suara sangat natural
- **Google Cloud Text-to-Speech** - Berbagai pilihan suara
- **Microsoft Azure TTS** - Suara natural dan ekspresif
- **Play.ht** - Voice cloning dan natural voices

### 3. Format File
- **MP3**: Format paling direkomendasikan, ukuran file kecil, kompatibilitas tinggi
- **WAV**: Kualitas tinggi tapi ukuran file besar
- Bitrate direkomendasikan: 128kbps - 320kbps untuk MP3

## Contoh Struktur Folder
```
public/
  └── audio/
      ├── README.md (file ini)
      └── anniversary-message.mp3 (file audio Anda)
```

## Testing
Setelah file audio diletakkan:
1. Restart development server (jika sedang running)
2. Buka halaman `/anniversary`
3. Klik tombol "Play Audio Message"
4. Audio akan mulai diputar

## Troubleshooting
- Jika audio tidak terdengar, cek volume sistem Anda
- Pastikan nama file tepat: `anniversary-message.mp3` atau `anniversary-message.wav`
- File harus berada di `public/audio/` bukan di tempat lain
- Coba refresh halaman (Ctrl+F5 atau Cmd+Shift+R)
