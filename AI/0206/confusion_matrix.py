import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix
from tensorflow.keras.models import load_model
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical

# 모델 로드
model = load_model("personal_color_classifier.h5")

# 데이터 로드 (예시로 X_val, y_val 준비)
# 실제로는 데이터를 로드하거나 train_test_split에서 나눈 데이터를 사용해야 합니다.
# 예: X_train, X_val, y_train, y_val = train_test_split(data, labels, test_size=0.2, random_state=42)

# y_val: 실제 레이블
# val_predictions: 모델이 예측한 확률
val_predictions = model.predict(X_val)
val_pred_classes = np.argmax(val_predictions, axis=1)  # 예측된 클래스
y_val_classes = np.argmax(y_val, axis=1)  # 실제 클래스

# Confusion Matrix 생성
conf_matrix = confusion_matrix(y_val_classes, val_pred_classes)

# Confusion Matrix 시각화
plt.figure(figsize=(10, 8))
sns.heatmap(conf_matrix, annot=True, fmt="d", cmap="Blues",
            xticklabels=categories, yticklabels=categories)
plt.xlabel("Predicted Class")
plt.ylabel("True Class")
plt.title("Confusion Matrix")
plt.show()
