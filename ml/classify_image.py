"""
Step 2: run a pretrained model on a single image.

A "pretrained" model is one someone else already trained on millions of images
(this one, ResNet18, was trained on ImageNet — 1000 everyday categories like
dog breeds, cars, cups). We just download it and use it. No training needed.
"""

import torch
from torchvision.models import resnet18, ResNet18_Weights
from PIL import Image  # PIL = the standard Python image library

# 1. Load the pretrained model.
#    .DEFAULT = "give me the best available trained weights".
#    The first run downloads them (~45 MB), then caches them.
weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)

# 2. Put the model in "evaluation mode" — tells it we're predicting, not training.
model.eval()

# 3. Open the image from disk.
image = Image.open("sample.jpg")

# 4. Preprocess: models expect images in a very specific format (resized,
#    cropped, turned into a tensor of numbers, color-normalized). The weights
#    come with the exact recipe they were trained with, so we just reuse it.
preprocess = weights.transforms()
input_tensor = preprocess(image)              # image -> tensor of numbers
input_batch = input_tensor.unsqueeze(0)       # models expect a BATCH, so wrap it

# 5. Run the image through the model.
#    no_grad() = "don't track math for training" — faster, less memory.
with torch.no_grad():
    output = model(input_batch)

# 6. The output is 1000 raw scores (one per category). Turn them into
#    probabilities that add up to 100%.
probabilities = torch.nn.functional.softmax(output[0], dim=0)

# 7. Grab the 5 highest-scoring categories and print them.
categories = weights.meta["categories"]       # the list of 1000 label names
top5_prob, top5_idx = torch.topk(probabilities, 5)

print("Top 5 guesses for sample.jpg:\n")
for prob, idx in zip(top5_prob, top5_idx):
    print(f"  {categories[idx]:<25} {prob.item() * 100:5.1f}%")
