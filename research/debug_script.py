import sys
import traceback

try:
    from standardize_articles import process_file
    process_file(r'C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research\is-suno-safe-commercial\index.html')
except Exception as e:
    with open('traceback.txt', 'w') as f:
        traceback.print_exc(file=f)
