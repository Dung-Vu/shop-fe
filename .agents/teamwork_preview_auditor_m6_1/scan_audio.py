import os
import re

directories = ["1-ice-frost", "2-warm-timber", "3-autumn", "4-winter", "5-forest", "6-river"]
root_files = ["index.html"]

audio_keywords = [
    r"audiocontext", r"web audio", r"audio", r"sound", r"oscillator", 
    r"synth", r"volume", r"speaker", r"mute", r"unmute", r"play"
]

print("=== ZERO AUDIO SCAN ===")
violations = []

def scan_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
        for idx, line in enumerate(lines):
            # check for keyword
            for kw in audio_keywords:
                match = re.search(kw, line, re.IGNORECASE)
                if match:
                    # check if the term is part of standard library keywords like "display", "play" is broad but we check
                    # wait, let's capture it and review
                    violations.append({
                        "file": filepath,
                        "line": idx + 1,
                        "content": line.strip(),
                        "keyword": kw
                    })
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

# Scan root index.html
scan_file(os.path.join("d:\\dashboard-cost", "index.html"))

# Scan dashboards
for d in directories:
    dir_path = os.path.join("d:\\dashboard-cost", d)
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith((".js", ".html", ".css")):
                scan_file(os.path.join(root, file))

print(f"Total potential occurrences found: {len(violations)}")
for v in violations:
    print(f"[{v['file']}:{v['line']}] (KW: {v['keyword']}): {v['content']}")
