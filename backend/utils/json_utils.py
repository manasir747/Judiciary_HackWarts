import json
import re
from typing import Any


def extract_json_object(payload: str) -> dict[str, Any]:
    payload = payload.strip()
    try:
        return json.loads(payload)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\}", payload)
    if not match:
        raise ValueError("No JSON object found in model output")

    return json.loads(match.group(0))
