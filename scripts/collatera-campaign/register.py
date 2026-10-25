"""Register a campaign film in Compositions.tsx: python3 register.py V6"""
import sys
from pathlib import Path
v = sys.argv[1]  # e.g. V6
low = v.lower()
p = Path(__file__).resolve().parents[2] / "src/compositions/CollateraCampaign/Compositions.tsx"
s = p.read_text()
if f"Collatera{v}" in s:
    sys.exit(0)
s = s.replace('import { Composition } from "remotion";\n', f'import {{ Composition }} from "remotion";\nimport {{ Collatera{v} }} from "./{v}";\nimport {low} from "./{low}.json";\n', 1)
s = s.replace("  </>\n", f'    <Composition id="Collatera{v}" component={{Collatera{v}}} width={{1920}} height={{1080}} fps={{60}} durationInFrames={{{low}.durationInFrames}} />\n  </>\n')
p.write_text(s)
