import cv2
import numpy as np

# Load image
img = cv2.imread(r"c:\Users\Asus\OneDrive\Desktop\Digital_Certificate_System\server\public\logo.png", cv2.IMREAD_UNCHANGED)

# Create a mask where all purely white and lightly off-white checker pixels become transparent
# Wait, actually, the provided image has a gray/white checkerboard pattern. 
# We can create a mask to find the "content"

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Find the bounding box of the largest contour (the logo itself)
largest_contour = max(contours, key=cv2.contourArea)
x,y,w,h = cv2.boundingRect(largest_contour)

# Crop
cropped = img[y:y+h, x:x+w]

# Now, any remaining checkerboard we want to turn pure white, but let's just save the crop first.
# the checkered pattern is likely #f0f0f0 and #ffffff. 
# so any pixel close to white can be made pure white or transparent.

b, g, r = cv2.split(cropped)
mask = np.logical_and.reduce((r > 230, g > 230, b > 230))

# Make background pure white
cropped[mask] = [255, 255, 255]

cv2.imwrite(r"c:\Users\Asus\OneDrive\Desktop\Digital_Certificate_System\server\public\logo_clean.png", cropped)
print("Logo cleaned successfully!")
