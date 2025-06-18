# University Notes New Version

A modern, collaborative platform for managing and sharing university study notes. Designed to boost your academic performance with AI-powered features, rich multimedia support, and real-time teamwork.

## 🚀 Features

- **Smart Note Organization**
  - AI-powered auto-tagging and categorization of notes
  - Smart search and category suggestions

- **Real-time Collaboration**
  - Live editing and commenting with classmates
  - Share and manage note permissions

- **Quick Capture**
  - Instantly capture ideas and lectures
  - Voice-to-text, image uploads, and quick templates

- **Progress Tracking & Analytics**
  - Track study progress with detailed analytics
  - Set goals and monitor your learning journey

- **Smart Recommendations**
  - Personalized study suggestions
  - AI-driven reminders and content recommendations

- **Comprehensive Notes**
  - Rich formatting and multimedia support, including YouTube links
  - Image sizes can be customized directly in Markdown using URL parameters
  - Detailed study materials for all your courses

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend/Database:** [Supabase](https://supabase.com/)
- **Styling:** Tailwind CSS
- **Authentication & Authorization:** Supabase Auth, Row Level Security (RLS) Policies

## 📚 Database Structure

- **Profiles:** User information, roles (admin, student), and permissions
- **Notes:** Title, content, subject code, status, author, and multimedia links
- **Collaborators:** Supports multiple users editing the same note

## 👥 Roles

- **Student:** Can create, edit, and collaborate on notes they own or are invited to
- **Admin:** Has additional permissions to view and update all profiles

## 🔐 Security

- Row Level Security (RLS) is enabled on all tables to protect user data
- Custom policies ensure only authorized users can view or modify notes and profiles

## 🏁 Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/DevAdvancer/University-Notes-New-Version.git
   cd University-Notes-New-Version
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Supabase:**
   - Set up a new [Supabase project](https://supabase.com/)
   - Copy your API keys and update environment variables accordingly

4. **Run the development server:**
   ```sh
   npm run dev
   ```

### Image sizing in Markdown

You can specify custom dimensions for images by appending `#width=` and
`#height=` parameters to the image URL.

```md
![Diagram](https://example.com/diagram.png#width=300&height=200)
```

This renders the image with the provided pixel dimensions.

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request for suggestions, bug fixes, or improvements.

## 📄 License

MIT

---

Made with ❤️ by [Abhirup Kumar](https://github.com/DevAdvancer)
