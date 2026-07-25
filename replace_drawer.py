import sys
import re

file_path = sys.argv[1]
with open(file_path, 'r') as f:
    content = f.read()

# Replace Drawer imports from ui/drawer with ui/sheet
content = content.replace("import {\n    Drawer,\n    DrawerContent,\n    DrawerDescription,\n    DrawerFooter,\n    DrawerHeader,\n    DrawerTitle,\n} from '@/components/ui/drawer';", "import {\n    Sheet,\n    SheetContent,\n    SheetDescription,\n    SheetFooter,\n    SheetHeader,\n    SheetTitle,\n} from '@/components/ui/sheet';")

# Replace tags
content = content.replace('<Drawer', '<Sheet')
content = content.replace('</Drawer', '</Sheet')
content = content.replace('<DrawerContent', '<SheetContent')
content = content.replace('</DrawerContent', '</SheetContent')
content = content.replace('<DrawerHeader', '<SheetHeader')
content = content.replace('</DrawerHeader', '</SheetHeader')
content = content.replace('<DrawerFooter', '<SheetFooter')
content = content.replace('</DrawerFooter', '</SheetFooter')
content = content.replace('<DrawerTitle', '<SheetTitle')
content = content.replace('</DrawerTitle', '</SheetTitle')
content = content.replace('<DrawerDescription', '<SheetDescription')
content = content.replace('</DrawerDescription', '</SheetDescription')

# Notice we keep useDrawerResize and DrawerResizeHandle as they are custom!

with open(file_path, 'w') as f:
    f.write(content)
