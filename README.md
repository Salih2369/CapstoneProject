# CapstoneProject


## 📁 Project Structure

```text
CapstoneProject/
├── 📂 BackEnd/
│   ├── 📂 config/           # Database connection & configurations
│   │   └── 📄 db.js
│   ├── 📂 controllers/      # Business logic (e.g., OpenRouter API logic)
│   │   └── 📄 chatbotController.js
│   ├── 📂 middleware/       # Authentication & Error handling
│   │   ├── 📄 auth.js
│   │   └── 📄 error.js
│   ├── 📂 models/           # Mongoose schemas / Database models
│   │   ├── 📄 Alert.js
│   │   ├── 📄 Branch.js
│   │   ├── 📄 Subscription.js
│   │   └── 📄 User.js
│   ├── 📂 routes/           # API Endpoints
│   │   └── 📄 userRoutes.js
│   ├── 📄 .env              # Environment variables (Private)
│   ├── 📄 .gitignore        # Files to ignore in Git
│   ├── 📄 package.json      # Dependencies and scripts
│   └── 📄 server.js         # Entry point of the application
├── 📂 FrontEnd/             # Chatbot UI & Client-side code
└── 📄 README.md             # Project documentation








## 💻 Full FrontEnd Structure

```text
CapstoneProject/
└── 📂 FrontEnd/
    ├── 📂 public/              # ملفات الـ HTML والأيقونات العامة
    │   └── 📄 index.html
    ├── 📂 src/
    │   ├── 📂 api/             # إعدادات الاتصال بالسيرفر
    │   │   ├── 📄 api.js
    │   │   └── 📄 client.js
    │   ├── 📂 assets/          # الصور والملفات المساعدة
    │   │   └── 🖼️ logo.png
    │   ├── 📂 components/      # العناصر القابلة لإعادة الاستخدام
    │   │   ├── 📄 Header.js
    │   │   ├── 📄 Skeleton.js
    │   │   └── 📄 ToastProvider.js
    │   ├── 📂 context/         # إدارة حالة المستخدم (Auth Context)
    │   │   └── 📄 AuthContext.js
    │   ├── 📂 css/             # ملفات التنسيق
    │   │   └── 📄 style.css
    │   ├── 📂 js/              # ملفات المنطق البرمجي المساعدة
    │   │   ├── 📄 api.js
    │   │   └── 📄 auth.js
    │   ├── 📂 middleware/      # حماية المسارات
    │   │   └── 📄 ProtectedRoute.js
    │   ├── 📂 pages/           # جميع صفحات النظام (ترتيب أبجدي)
    │   │   ├── 📄 AdminUsers.js
    │   │   ├── 📄 Alerts.js
    │   │   ├── 📄 AnalyticsChat.js  <-- (صفحة الشات بوت الجديدة)
    │   │   ├── 📄 Branches.js
    │   │   ├── 📄 Chatbot.js
    │   │   ├── 📄 Dashboard.js
    │   │   ├── 📄 Demo.js
    │   │   ├── 📄 Home.js
    │   │   ├── 📄 Login.js
    │   │   ├── 📄 NewChatbot.js
    │   │   ├── 📄 Onboarding.js
    │   │   ├── 📄 Profile.js
    │   │   ├── 📄 Register.js
    │   │   ├── 📄 Reports.js
    │   │   ├── 📄 Settings.js
    │   │   └── 📄 Subscription.js
    │   ├── 📄 App.js           # المكون الرئيسي لتوجيه الصفحات (Routing)
    │   └── 📄 index.js         # نقطة انطلاق التطبيق
    ├── 📄 .env.example         # نموذج مفاتيح الـ API (Frontend)
    ├── 📄 package.json         # المكتبات والاعتمادات
    └── 📄 README.md            # توثيق قسم الفرونت إند













