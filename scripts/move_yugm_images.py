from pathlib import Path
import shutil

root = Path(__file__).resolve().parent.parent
src = root / 'public' / 'assets' / 'yugm'
dst = root / 'public' / 'artists' / 'yugm'

if not src.exists():
    print('SOURCE_MISSING', src)
else:
    dst.mkdir(parents=True, exist_ok=True)
    for item in src.iterdir():
        if item.is_file():
            target = dst / item.name
            if target.exists():
                target.unlink()
            shutil.move(str(item), str(target))
            print('MOVED', item.name)
    try:
        src.rmdir()
        print('REMOVED_SRC_DIR')
    except OSError as e:
        print('SRC_NOT_EMPTY_OR_ERROR', e)
