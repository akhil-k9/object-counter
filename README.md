# 🚀 Object Counter using YOLO

An AI-powered web application that detects and counts objects in images using a custom-trained YOLO model. The application provides an intuitive interface where users can upload an image and instantly receive object detection results with bounding boxes and total object counts.

## 📌 Features

- 🔍 Detects multiple objects in an image
- 📊 Counts the total number of detected objects
- 🎯 Custom YOLO model for high accuracy
- 🌐 Simple web interface using Flask
- ⚡ Fast image processing
- 📦 Easy deployment and setup

---

## 🛠️ Tech Stack

- **Python**
- **Flask**
- **YOLO (Ultralytics)**
- **OpenCV**
- **HTML**
- **CSS**
- **JavaScript**

---

## 📂 Project Structure

```
object-counter/
│── static/
│── templates/
│── app.py
│── best_model.pt
│── requirements.txt
│── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/akhil-k9/object-counter.git
cd object-counter
```

### 2. Create a virtual environment (Optional)

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Run the Application

```bash
python app.py
```

Open your browser and visit:

```
http://127.0.0.1:5000
```

---

## 📸 How It Works

1. Upload an image.
2. The image is processed using the trained YOLO model.
3. Objects are detected with bounding boxes.
4. The application displays:
   - Detected image
   - Object labels
   - Number of detected objects

---

## 📷 Sample Output

| Input Image | Detection Result |
|-------------|------------------|
| Upload Image | Image with bounding boxes and object count |

> *(You can add screenshots here later.)*

---

## 📦 Requirements

Example packages:

- Flask
- ultralytics
- opencv-python
- numpy
- pillow

Install all using:

```bash
pip install -r requirements.txt
```

---

## 🎯 Applications

- Warehouse Inventory Management
- Traffic Monitoring
- Retail Analytics
- Industrial Automation
- Smart Surveillance
- Manufacturing Quality Inspection

---

## 🚀 Future Improvements

- 🎥 Real-time webcam detection
- 📹 Video object counting
- 📈 Detection analytics dashboard
- ☁️ Cloud deployment
- 📱 Mobile responsive interface
- 📄 Export detection reports

---

## 👨‍💻 Author

**Kandyula Akhil**

- GitHub: https://github.com/akhil-k9

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
