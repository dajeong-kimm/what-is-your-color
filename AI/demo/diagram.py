import os
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import plot_model

# Load model from new_model.h5
model_path = "./new_model.h5"
if not os.path.exists(model_path):
    print(f"Model file not found: {model_path}")
else:
    print(f"Loading model from: {model_path}")
    model = load_model(model_path)
    print("Model loaded successfully")

# Save model architecture diagram
architecture_path = "./model_architecture.png"

# Visualize and save model diagram
plot_model(
    model, 
    to_file=architecture_path, 
    show_shapes=True,       # Show input/output shapes
    show_layer_names=True,  # Show layer names
    expand_nested=True,     # Expand nested layers
    dpi=150
)
print(f"Model architecture diagram saved to: {architecture_path}")

# Display the diagram
img = mpimg.imread(architecture_path)
plt.figure(figsize=(12, 15))
plt.imshow(img)
plt.axis('off')
plt.title("Model Architecture: MobileNetV2-based Personal Color Classifier")
plt.show()
