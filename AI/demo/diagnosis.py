import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage import color
from scipy.spatial import distance

# Color conversion and Delta E calculation functions
def rgb_to_lab(hex_code):
    hex_code = hex_code.lstrip("#")
    if len(hex_code) != 6:
        raise ValueError(f"Invalid HEX color format: {hex_code}")
    rgb = np.array([int(hex_code[i:i+2], 16) for i in (0, 2, 4)]) / 255.0
    return color.rgb2lab([[rgb]])[0][0]

def delta_e(color1, color2):
    return distance.euclidean(color1, color2)

def to_hex(color):
    return "#{:02X}{:02X}{:02X}".format(int(color[0]), int(color[1]), int(color[2]))

# Example extracted colors (in RGB)
skin_avg = np.array([230, 150, 130])  # Skin average color
skin_highlight = np.array([250, 200, 180])  # Skin highlight color
eye_color = np.array([80, 60, 50])  # Eye color
hair_color = np.array([100, 70, 60])  # Hair color

# Convert to LAB for Delta E calculation
colors_lab = {
    "Skin Average": color.rgb2lab([[skin_avg / 255.0]])[0][0],
    "Skin Highlight": color.rgb2lab([[skin_highlight / 255.0]])[0][0],
    "Eye": color.rgb2lab([[eye_color / 255.0]])[0][0],
    "Hair": color.rgb2lab([[hair_color / 255.0]])[0][0]
}

# Display Delta E comparison
plt.figure(figsize=(8, 5))
for i, (label1, lab1) in enumerate(colors_lab.items()):
    for j, (label2, lab2) in enumerate(colors_lab.items()):
        if i < j:
            diff = delta_e(lab1, lab2)
            print(f"Delta E between {label1} and {label2}: {diff:.2f}")
            plt.plot([i, j], [0.5, 0.5], label=f"{label1} vs {label2} \nΔE: {diff:.2f}", lw=2)

# Plot the extracted colors
for i, (label, rgb) in enumerate(zip(colors_lab.keys(), [skin_avg, skin_highlight, eye_color, hair_color])):
    plt.scatter(i, 0.5, color=rgb/255.0, s=200, edgecolors='k', label=f"{label}")

plt.title("Delta E Comparison Between Extracted Colors")
plt.axis('off')
plt.legend()
plt.show()