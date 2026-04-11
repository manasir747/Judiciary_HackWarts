import re
import sys
import os

# Mock the environment or dependencies if needed
# But primarily we want to test the regex extraction logic here

def test_summary_extraction(text):
    print(f"Testing text: {text}")
    summary_match = re.search(r"SUMMARY:\s*(.*)", text, re.DOTALL | re.IGNORECASE)
    if summary_match:
        extracted = summary_match.group(1).strip()
        print(f"Extracted: '{extracted}'")
        return extracted
    else:
        print("No summary found")
        return None

# Test cases
samples = [
    "Here is the report. SUMMARY: This is a legal summary. END",
    "SUMMARY: Only summary text",
    "Preliminary info. SUMMARY: Multi-line\nSummary\nText\nHere.",
    "No summary section here.",
    "summary: case insensitive test"
]

for s in samples:
    test_summary_extraction(s)
    print("-" * 20)
