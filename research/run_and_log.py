import traceback
from standardize_articles import process_file

try:
    process_file(r'C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research\is-suno-safe-commercial\index.html')
except Exception:
    with open('error.txt', 'w') as f:
        traceback.print_exc(file=f)
