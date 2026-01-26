from PIL import Image, ImageDraw, ImageFont
import os

# Create a simple icon - lowercase 'n' in a circle
size = 128
img = Image.new('RGB', (size, size), color='#fafafa')
draw = ImageDraw.Draw(img)

# Draw circle background
circle_margin = 10
draw.ellipse([circle_margin, circle_margin, size-circle_margin, size-circle_margin], 
             fill='#1a1a1a', outline='#1a1a1a')

# Draw lowercase 'n' in the center
try:
    # Try Windows fonts first (Segoe UI is the modern Windows system font)
    font = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 80)
except:
    try:
        # Try Linux fonts
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 100)
    except:
        # Fall back to default
        font = ImageFont.load_default()

# Get text bbox and center it
text = "n"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (size - text_width) // 2 - bbox[0]
y = (size - text_height) // 2 - bbox[1] 

draw.text((x, y), text, fill='#fafafa', font=font)

# Save
img.save('icon.png')
print("Icon created successfully")
