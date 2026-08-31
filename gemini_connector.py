"""
AI Connector untuk Google Gemini (gemini-2.5-flash-lite)
=======================================================
Modul ini menyediakan antarmuka Python untuk berinteraksi dengan model
Gemini 2.5 Flash Lite melalui Google AI Studio (free tier).

Fitur:
  - Chat completion single-turn dan multi-turn
  - Streaming response (token demi token)
  - System instruction untuk mengatur perilaku model
  - Temperature dan max tokens yang dapat dikonfigurasi
  - Penanganan rate limit dengan retry + exponential backoff

Library yang digunakan: google-genai (SDK terpadu Google AI)
Dokumentasi: https://ai.google.dev/gemini-api/docs/sdks
"""

import os
import time
import json
import asyncio
from typing import Any, AsyncIterator

# Import SDK google-genai (nama paket: google-genai, import: genai)
from google import genai
from google.genai import types
from google.genai.errors import ClientError, ServerError


# ============================================================
# KONFIGURASI DEFAULT
# ============================================================

# Nama model yang digunakan — sesuai permintaan: gemini-2.5-flash-lite
DEFAULT_MODEL = "gemini-2.5-flash-lite"

# Batas token output maksimum (free tier Gemini mendukung hingga 8192)
DEFAULT_MAX_TOKENS = 2048

# Temperature default (0.0 = deterministik, 1.0 = kreatif)
DEFAULT_TEMPERATURE = 0.7

# Top-P default (nucleus sampling)
DEFAULT_TOP_P = 0.95

# Jumlah maksimum retry saat terkena rate limit
MAX_RETRIES = 5

# Delay awal backoff dalam detik (akan dikalikan 2 setiap retry)
INITIAL_BACKOFF_SECONDS = 1.0

# Batas atas backoff agar tidak menunggu terlalu lama
MAX_BACKOFF_SECONDS = 60.0


# ============================================================
# KELAS UTAMA: GeminiConnector
# ============================================================

class GeminiConnector:
    """
    Connector untuk model Gemini 2.5 Flash Lite.

    Mengambil API key dari environment variable GEMINI_API_KEY.
    Jika tidak ditemukan, akan raise ValueError saat inisialisasi.

    Penggunaan dasar:
        connector = GeminiConnector()
        reply = connector.chat("Halo, apa kabar?")
        print(reply)

    Penggunaan multi-turn:
        connector = GeminiConnector(system_instruction="Kamu adalah tutor matematika.")
        connector.add_user_message("Berapa 5 + 3?")
        connector.add_model_message("8")
        connector.add_user_message("Kalau dikali 2?")
        reply = connector.chat()  # melanjutkan percakapan
    """

    def __init__(
        self,
        api_key: str | None = None,
        model: str = DEFAULT_MODEL,
        system_instruction: str | None = None,
        temperature: float = DEFAULT_TEMPERATURE,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        top_p: float = DEFAULT_TOP_P,
    ):
        """
        Inisialisasi connector Gemini.

        Args:
            api_key:            API key Google AI Studio. Jika None, akan
                                diambil dari environment variable GEMINI_API_KEY.
            model:              Nama model yang digunakan.
            system_instruction: Instruksi sistem untuk mengatur perilaku model.
            temperature:        Mengontrol keacakan output (0.0–2.0).
            max_tokens:         Jumlah maksimum token output.
            top_p:              Nucleus sampling (0.0–1.0).
        """
        # Ambil API key dari parameter atau environment variable
        resolved_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not resolved_key:
            raise ValueError(
                "API key tidak ditemukan. Set environment variable GEMINI_API_KEY "
                "atau kirim via parameter api_key."
            )

        # Inisialisasi client google-genai
        # Client ini otomatis menggunakan endpoint Google AI Studio (free tier)
        self._client = genai.Client(api_key=resolved_key)
        self._model = model
        self._system_instruction = system_instruction
        self._temperature = temperature
        self._max_tokens = max_tokens
        self._top_p = top_p

        # Riwayat percakapan untuk multi-turn chat
        # Format: list of dict dengan key "role" ("user"/"model") dan "parts"
        self._history: list[types.Content] = []

    # --------------------------------------------------------
    # Properti konfigurasi (bisa diubah setelah inisialisasi)
    # --------------------------------------------------------

    @property
    def model(self) -> str:
        return self._model

    @model.setter
    def model(self, value: str) -> None:
        self._model = value

    @property
    def temperature(self) -> float:
        return self._temperature

    @temperature.setter
    def temperature(self, value: float) -> None:
        self._temperature = max(0.0, min(2.0, value))

    @property
    def max_tokens(self) -> int:
        return self._max_tokens

    @max_tokens.setter
    def max_tokens(self, value: int) -> None:
        self._max_tokens = max(1, value)

    @property
    def system_instruction(self) -> str | None:
        return self._system_instruction

    @system_instruction.setter
    def system_instruction(self, value: str | None) -> None:
        self._system_instruction = value

    # --------------------------------------------------------
    # Manajemen riwayat percakapan
    # --------------------------------------------------------

    def add_user_message(self, text: str) -> None:
        """Tambahkan pesan dari user ke riwayat percakapan."""
        self._history.append(
            types.Content(role="user", parts=[types.Part(text=text)])
        )

    def add_model_message(self, text: str) -> None:
        """Tambahkan pesan dari model ke riwayat percakapan."""
        self._history.append(
            types.Content(role="model", parts=[types.Part(text=text)])
        )

    def clear_history(self) -> None:
        """Hapus seluruh riwayat percakapan."""
        self._history = []

    def get_history(self) -> list[types.Content]:
        """Ambil salinan riwayat percakapan saat ini."""
        return list(self._history)

    # --------------------------------------------------------
    # Builder config internal
    # --------------------------------------------------------

    def _build_config(self) -> types.GenerateContentConfig:
        """
        Bangun objek konfigurasi untuk request Gemini.
        Mencakup system instruction, temperature, max tokens, dan top_p.
        """
        return types.GenerateContentConfig(
            system_instruction=self._system_instruction,
            temperature=self._temperature,
            max_output_tokens=self._max_tokens,
            top_p=self._top_p,
        )

    # --------------------------------------------------------
    # CHAT COMPLETION (single & multi-turn)
    # --------------------------------------------------------

    def chat(self, message: str | None = None) -> str:
        """
        Kirim pesan ke model dan dapatkan respons teks.

        - Jika `message` diberikan, pesan tersebut ditambahkan ke riwayat
          lalu dikirim (mode multi-turn atau single-turn).
        - Jika `message` None, mengirim seluruh riwayat yang ada tanpa
          menambah pesan baru (berguna setelah add_user_message manual).

        Args:
            message: Pesan teks dari user (opsional).

        Returns:
            Respons teks dari model.
        """
        # Jika ada pesan baru, tambahkan ke riwayat
        if message is not None:
            self.add_user_message(message)

        # Jika riwayat kosong dan tidak ada pesan, kembalikan string kosong
        if not self._history:
            return ""

        # Bangun config
        config = self._build_config()

        # Kirim request dengan retry + exponential backoff
        response = self._generate_with_retry(config)

        # Ekstrak teks dari respons
        reply = self._extract_text(response)

        # Tambahkan respons model ke riwayat agar percakapan bisa dilanjutkan
        self.add_model_message(reply)

        return reply

    # --------------------------------------------------------
    # STREAMING RESPONSE
    # --------------------------------------------------------

    def stream(self, message: str | None = None) -> Any:
        """
        Kirim pesan dan dapatkan respons secara streaming (token demi token).

        Mengembalikan iterator yang mengeluarkan potongan teks satu per satu.

        Args:
            message: Pesan teks dari user (opsional).

        Returns:
            Iterator yang yield string per potongan token.

        Contoh:
            connector = GeminiConnector()
            for chunk in connector.stream("Ceritakan tentang tata surya"):
                print(chunk, end="", flush=True)
        """
        if message is not None:
            self.add_user_message(message)

        if not self._history:
            return

        config = self._build_config()

        # Kirim request streaming dengan retry
        stream = self._stream_with_retry(config)

        # Kumpulkan seluruh teks untuk ditambahkan ke riwayat setelah selesai
        full_text_parts: list[str] = []

        for chunk in stream:
            # Ekstrak teks dari setiap chunk
            chunk_text = self._extract_text(chunk)
            if chunk_text:
                full_text_parts.append(chunk_text)
                yield chunk_text

        # Tambahkan respons lengkap ke riwayat
        if full_text_parts:
            self.add_model_message("".join(full_text_parts))

    # --------------------------------------------------------
    # VERSI ASYNC (untuk aplikasi async/asynchronous)
    # --------------------------------------------------------

    async def chat_async(self, message: str | None = None) -> str:
        """
        Versi asynchronous dari chat().
        Berguna untuk aplikasi yang menggunakan asyncio (mis. web server FastAPI).

        Args:
            message: Pesan teks dari user (opsional).

        Returns:
            Respons teks dari model.
        """
        if message is not None:
            self.add_user_message(message)

        if not self._history:
            return ""

        config = self._build_config()
        response = await self._generate_async_with_retry(config)
        reply = self._extract_text(response)
        self.add_model_message(reply)
        return reply

    async def stream_async(self, message: str | None = None) -> AsyncIterator[str]:
        """
        Versi asynchronous dari stream().
        Mengembalikan async iterator yang yield potongan teks.

        Contoh:
            async for chunk in connector.stream_async("Halo"):
                print(chunk, end="", flush=True)
        """
        if message is not None:
            self.add_user_message(message)

        if not self._history:
            return

        config = self._build_config()
        stream = await self._stream_async_with_retry(config)

        full_text_parts: list[str] = []
        async for chunk in stream:
            chunk_text = self._extract_text(chunk)
            if chunk_text:
                full_text_parts.append(chunk_text)
                yield chunk_text

        if full_text_parts:
            self.add_model_message("".join(full_text_parts))

    # ============================================================
    # INTERNAL: Retry + Exponential Backoff
    # ============================================================

    def _calculate_backoff(self, attempt: int) -> float:
        """
        Hitung durasi backoff untuk percobaan ke-`attempt`.
        Menggunakan exponential backoff dengan jitter sederhana.
        """
        # Backoff = initial * 2^attempt, dibatasi oleh MAX_BACKOFF_SECONDS
        backoff = INITIAL_BACKOFF_SECONDS * (2 ** attempt)
        return min(backoff, MAX_BACKOFF_SECONDS)

    def _is_rate_limit_error(self, error: Exception) -> bool:
        """
        Cek apakah error yang terjadi adalah rate limit (HTTP 429)
        atau error server sementara (HTTP 5xx) yang perlu retry.
        """
        # ClientError dengan status 429 = rate limit
        if isinstance(error, ClientError):
            status = getattr(error, "status_code", None)
            if status == 429:
                return True
            # 5xx = error server, mungkin sementara
            if status is not None and 500 <= status < 600:
                return True
        # ServerError = error server, layak retry
        if isinstance(error, ServerError):
            return True
        return False

    def _generate_with_retry(
        self, config: types.GenerateContentConfig
    ) -> types.GenerateContentResponse:
        """
        Kirim request generate_content dengan retry + exponential backoff.
        Digunakan untuk mode non-streaming.
        """
        last_error: Exception | None = None

        for attempt in range(MAX_RETRIES):
            try:
                response = self._client.models.generate_content(
                    model=self._model,
                    contents=self._history,
                    config=config,
                )
                return response
            except Exception as err:
                last_error = err
                if self._is_rate_limit_error(err):
                    wait = self._calculate_backoff(attempt)
                    print(
                        f"[GeminiConnector] Rate limit / server error. "
                        f"Retry {attempt + 1}/{MAX_RETRIES} dalam {wait:.1f}s..."
                    )
                    time.sleep(wait)
                    continue
                # Jika bukan rate limit, lempar error langsung
                raise

        # Jika semua retry gagal, lempar error terakhir
        raise RuntimeError(
            f"Gagal setelah {MAX_RETRIES} retry. Error terakhir: {last_error}"
        )

    def _stream_with_retry(
        self, config: types.GenerateContentConfig
    ) -> Any:
        """
        Kirim request streaming dengan retry + exponential backoff.
        Mengembalikan iterator streaming.
        """
        last_error: Exception | None = None

        for attempt in range(MAX_RETRIES):
            try:
                stream = self._client.models.generate_content_stream(
                    model=self._model,
                    contents=self._history,
                    config=config,
                )
                return stream
            except Exception as err:
                last_error = err
                if self._is_rate_limit_error(err):
                    wait = self._calculate_backoff(attempt)
                    print(
                        f"[GeminiConnector] Rate limit / server error. "
                        f"Retry {attempt + 1}/{MAX_RETRIES} dalam {wait:.1f}s..."
                    )
                    time.sleep(wait)
                    continue
                raise

        raise RuntimeError(
            f"Gagal setelah {MAX_RETRIES} retry. Error terakhir: {last_error}"
        )

    async def _generate_async_with_retry(
        self, config: types.GenerateContentConfig
    ) -> types.GenerateContentResponse:
        """
        Versi async dari _generate_with_retry untuk aplikasi asyncio.
        """
        last_error: Exception | None = None

        for attempt in range(MAX_RETRIES):
            try:
                response = await self._client.aio.models.generate_content(
                    model=self._model,
                    contents=self._history,
                    config=config,
                )
                return response
            except Exception as err:
                last_error = err
                if self._is_rate_limit_error(err):
                    wait = self._calculate_backoff(attempt)
                    print(
                        f"[GeminiConnector] Rate limit / server error. "
                        f"Retry {attempt + 1}/{MAX_RETRIES} dalam {wait:.1f}s..."
                    )
                    await asyncio.sleep(wait)
                    continue
                raise

        raise RuntimeError(
            f"Gagal setelah {MAX_RETRIES} retry. Error terakhir: {last_error}"
        )

    async def _stream_async_with_retry(
        self, config: types.GenerateContentConfig
    ) -> Any:
        """
        Versi async dari _stream_with_retry untuk aplikasi asyncio.
        """
        last_error: Exception | None = None

        for attempt in range(MAX_RETRIES):
            try:
                stream = await self._client.aio.models.generate_content_stream(
                    model=self._model,
                    contents=self._history,
                    config=config,
                )
                return stream
            except Exception as err:
                last_error = err
                if self._is_rate_limit_error(err):
                    wait = self._calculate_backoff(attempt)
                    print(
                        f"[GeminiConnector] Rate limit / server error. "
                        f"Retry {attempt + 1}/{MAX_RETRIES} dalam {wait:.1f}s..."
                    )
                    await asyncio.sleep(wait)
                    continue
                raise

        raise RuntimeError(
            f"Gagal setelah {MAX_RETRIES} retry. Error terakhir: {last_error}"
        )

    # ============================================================
    # INTERNAL: Ekstraksi teks dari respons
    # ============================================================

    def _extract_text(self, response: Any) -> str:
        """
        Ekstrak teks dari objek respons Gemini.
        Menangani berbagai struktur respons yang mungkin diterima.
        """
        # Respons normal (GenerateContentResponse)
        if hasattr(response, "text") and response.text:
            return response.text

        # Respons streaming (chunk) — akses candidates
        if hasattr(response, "candidates") and response.candidates:
            for candidate in response.candidates:
                if hasattr(candidate, "content") and candidate.content:
                    for part in candidate.content.parts:
                        if hasattr(part, "text") and part.text:
                            return part.text

        # Fallback: tidak ada teks ditemukan
        return ""


# ============================================================
# FUNGSI PEMBANTU: Buat connector dari environment
# ============================================================

def create_connector(
    system_instruction: str | None = None,
    temperature: float = DEFAULT_TEMPERATURE,
    max_tokens: int = DEFAULT_MAX_TOKENS,
) -> GeminiConnector:
    """
    Fungsi pembantu untuk membuat GeminiConnector dengan konfigurasi default.

    API key otomatis diambil dari environment variable GEMINI_API_KEY.

    Args:
        system_instruction: Instruksi sistem untuk model.
        temperature:        Nilai temperature (0.0–2.0).
        max_tokens:         Maksimum token output.

    Returns:
        Instance GeminiConnector siap digunakan.
    """
    return GeminiConnector(
        system_instruction=system_instruction,
        temperature=temperature,
        max_tokens=max_tokens,
    )


# ============================================================
# BLOK CONTOH PENGGUNAAN
# ============================================================

if __name__ == "__main__":
    # --- Contoh 1: Single-turn chat sederhana ---
    print("=" * 60)
    print("Contoh 1: Single-turn chat")
    print("=" * 60)

    connector = create_connector(
        system_instruction="Kamu adalah asisten belajar yang ramah untuk siswa SMP.",
        temperature=0.7,
        max_tokens=512,
    )

    reply = connector.chat("Jelaskan apa itu fotosintesis dengan bahasa sederhana.")
    print(f"Respons: {reply}\n")

    # --- Contoh 2: Multi-turn chat ---
    print("=" * 60)
    print("Contoh 2: Multi-turn chat")
    print("=" * 60)

    connector2 = create_connector(
        system_instruction="Kamu adalah tutor matematika sabar dan jelas.",
    )
    # Percakapan turn 1
    reply1 = connector2.chat("Berapa hasil 12 x 8?")
    print(f"Turn 1: {reply1}\n")

    # Percakapan turn 2 (melanjutkan konteks sebelumnya)
    reply2 = connector2.chat("Bagaimana kalau dibagi 4?")
    print(f"Turn 2: {reply2}\n")

    # --- Contoh 3: Streaming response ---
    print("=" * 60)
    print("Contoh 3: Streaming response")
    print("=" * 60)

    connector3 = create_connector()
    print("Respons (streaming): ", end="", flush=True)
    for chunk in connector3.stream("Ceritakan 3 fakta menarik tentang tata surya."):
        print(chunk, end="", flush=True)
    print("\n")

    # --- Contoh 4: Async chat ---
    print("=" * 60)
    print("Contoh 4: Async chat")
    print("=" * 60)

    async def run_async_example():
        connector4 = create_connector(
            system_instruction="Kamu adalah ahli biologi.",
        )
        reply = await connector4.chat_async("Apa perbedaan sel hewan dan sel tumbuhan?")
        print(f"Respons async: {reply}\n")

    asyncio.run(run_async_example())
