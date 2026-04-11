from io import BytesIO
import pdfplumber


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    text_chunks = []
    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            if text.strip():
                text_chunks.append(text)
    return "\n\n".join(text_chunks).strip()
