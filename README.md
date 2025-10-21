# 💖 Love Chat - AI Romantic Companion

Aplikasi chat AI romantis yang mengingat semua hal kecil tentang pasangan Anda. Dibangun dengan Next.js 15, Ollama, dan SQLite dengan **comprehensive memory system** untuk authentic personality representation.

## ✨ Features

- 🤖 **AI Chat** - Percakapan romantis dengan LLM (Ollama)
- 🧠 **Comprehensive Memory System** - 10 kategorized memory types dengan importance & tags
- 📝 **Advanced Memory Management** - Full CRUD dengan search, filter, dan category organization
- 📤 **Import/Export** - Backup dan restore memories dalam JSON
- 🎨 **Beautiful UI** - Gradient pink/purple theme dengan Framer Motion animations
- � **Smart Search** - Real-time search across keys, values, and tags
- 🏷️ **Category Filters** - Filter by 10 memory categories
- ⭐ **Importance Levels** - 1-5 star priority system
- 🔧 **Tool Calling** - LLM dapat menggunakan tools (memory, datetime, countdown)
- 💬 **Natural Language** - Enhanced dengan emotional intelligence & speech patterns

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
OLLAMA_URL=http://localhost:11434
LOVE_MODEL=qwen2.5:7b-instruct
ANNIV_DATE=2022-10-22
```

### 3. Setup Ollama

```bash
# Install Ollama (jika belum)
# https://ollama.ai

# Pull recommended model (best for Indonesian + emotional intelligence)
ollama pull qwen2.5:7b-instruct

# Run Ollama
ollama serve
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Setup Memories (Choose One)

**Option A: Import Template (Fastest)**
```bash
1. Go to http://localhost:3000/memories
2. Click 📤 Import button
3. Select memories-comprehensive-template.json
4. Edit imported entries with your real data
```

**Option B: Manual Entry (Detailed)**
```bash
1. Go to http://localhost:3000/memories
2. Click "+ Tambah Memory"
3. Fill form with category, importance, tags
4. Save and repeat
```

**Option C: Hybrid (Recommended)**
```bash
1. Import template for structure
2. Keep top 20 essential entries
3. Add your own custom entries
4. Expand gradually over time
```

---

## 📖 Documentation

### **Getting Started:**
- 📋 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Cheat sheet & essential info (5 min read)
- 📚 [MEMORY_GUIDE.md](./MEMORY_GUIDE.md) - Comprehensive guide with examples (20 min read)
- ✅ [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What's been built & how to use

### **Templates:**
- 📄 [memories-comprehensive-template.json](./memories-comprehensive-template.json) - 40+ example entries

### **Tech Docs:**
- 🧠 Memory system architecture
- 🔧 API endpoints
- 🎨 UI components

---

## 🎯 Core Concepts

### **10 Memory Categories**

| Category | Use For | Examples |
|----------|---------|----------|
| 👤 **Personal** | Identity & background | your_name, partner_birthday |
| 💑 **Relationship** | Milestones & story | anniversary_date, how_you_met |
| ⭐ **Preferences** | Likes & dislikes | favorite_food, hates_food |
| 📍 **Places** | Locations | favorite_restaurant, dream_destination |
| ❤️ **Emotional** | Love language | love_language_primary, comfort_method |
| 💬 **Communication** | How you talk | morning_greeting, pet_name_usage |
| 😄 **Inside Jokes** | Private humor | joke_nickname, funny_moment |
| ✨ **Special Moments** | Memorable events | first_trip, best_date_ever |
| 🎯 **Goals** | Future plans | goal_marriage, bucket_list |
| � **Current Context** | Right now | current_mood, upcoming_event |

### **Importance Levels**

- ⭐⭐⭐⭐⭐ **Critical** - Names, anniversary, love language
- ⭐⭐⭐⭐ **Very Important** - Major preferences, emotional triggers
- ⭐⭐⭐ **Important** - Common preferences, hobbies
- ⭐⭐ **Nice to Know** - Minor details
- ⭐ **Optional** - Trivial information

### **Top 20 Essential Entries**

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for the complete checklist!

---

## 🗂️ Project Structure

```
love-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/          # Chat endpoint with auto-learning
│   │   │   └── memories/      # Enhanced CRUD with categories
│   │   ├── chat/              # Chat UI
│   │   ├── memories/          # Advanced memory management UI
│   │   ├── surprise/          # Surprise messages
│   │   └── page.tsx           # Home page with countdown
│   ├── components/            # Card, Header
│   ├── lib/
│   │   ├── llm.ts            # Ollama integration
│   │   ├── memory.ts         # Enhanced database with categories/tags
│   │   ├── tools.ts          # Tool execution
│   │   └── persona.ts        # Enhanced system prompt
│   └── core/
│       └── types.ts          # TypeScript types
├── memories.db               # SQLite database (auto-created)
├── memories-comprehensive-template.json  # Import template
├── MEMORY_GUIDE.md           # Comprehensive guide
├── QUICK_REFERENCE.md        # Quick cheat sheet
├── IMPLEMENTATION_SUMMARY.md # Implementation details
└── .env                      # Environment config
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Runtime:** Node.js (for SQLite)
- **LLM:** Ollama (qwen2.5:7b-instruct recommended)
- **Database:** SQLite + better-sqlite3 with enhanced schema
- **UI:** Tailwind CSS v4 + Framer Motion
- **Fonts:** Inter Variable, Plus Jakarta Sans
- **Language:** TypeScript (strict mode)

---

## 📊 Memory System Features

### **Enhanced Database Schema**
- 10 memory categories
- Importance levels (1-5)
- Searchable tags
- Who attribution (self/partner/both)
- Source tracking (manual/chat/import)
- Confidence levels
- Timestamps

### **Advanced UI**
- Real-time search across all fields
- Category filtering with counts
- Importance visualization (stars)
- Tag chips display
- Color-coded categories
- Import/Export functionality

### **Smart API**
- Category-based queries
- Tag-based search
- Importance-based sorting
- Bulk import/export
- Validation & defaults

---

## 🧪 Testing the System

### Test Auto-Learning
```bash
1. Go to /chat
2. Say: "Aku suka pizza!"
3. Check /memories - should auto-save
4. Ask: "Makanan favorit aku apa?"
5. Bot should respond with "Pizza"
```

### Test Manual Entry
```bash
1. Go to /memories
2. Add: favorite_food = "Sushi" (category: preferences, importance: 4⭐)
3. Add tags: "food, restaurant, date_night"
4. Save and go to /chat
5. Ask: "Makanan favorit aku apa?"
6. Bot should mention "Sushi"
```

### Test Search & Filter
```bash
1. Go to /memories
2. Try search: "food" → shows all food-related
3. Filter by category: "Preferences" → shows only preferences
4. Check importance stars and tags display
```

### Test Import/Export
```bash
1. Go to /memories
2. Export current data (📥 button)
3. Edit JSON file
4. Import back (📤 button)
5. Verify changes applied
```

---

## 🔧 Customization

### Add Custom Category

Edit `src/lib/memory.ts`:

```typescript
export type MemoryCategory = 
    | 'personal' 
    | 'your_custom_category'  // Add here
    | 'general';
```

Edit `src/app/memories/page.tsx`:

```typescript
const CATEGORIES = [
    { value: 'your_custom_category', label: '🎨 Your Label', color: 'bg-cyan-100 text-cyan-700' },
    // ...
];
```

### Customize System Prompt

Edit `src/lib/persona.ts` for:
- Communication style
- Emotional responses  
- DO/DON'T examples
- Tool usage instructions

---

## 💡 Best Practices

1. **Start Small** - Fill top 20 essentials first
2. **Be Specific** - "Salmon sushi from Sushi Tei" > "sushi"
3. **Update Current Context** - Daily updates make responses fresh
4. **Tag Consistently** - Use same tags across entries
5. **Export Regularly** - Weekly backups prevent data loss
6. **Review Bot Responses** - Check if memories are used correctly

See [MEMORY_GUIDE.md](./MEMORY_GUIDE.md) for detailed tips!

---

## 🐛 Troubleshooting

### **Bot doesn't remember**
- Check if memory exists in `/memories`
- Verify importance level (higher = more priority)
- Update current_context if outdated
- Check category is relevant

### **Search not working**
- Try different keywords
- Check if category filter is active
- Search works on: key, value, tags

### **Import fails**
- Validate JSON syntax
- Ensure required fields present (key, value)
- Check template format matches

### **CSS not loading**
- Ensure `@import "tailwindcss";` in `globals.css`
- Restart dev server

See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for more troubleshooting!

---

## 📈 Roadmap

### ✅ **Completed (v2.0)**
- Enhanced memory system with categories
- Search & filter functionality
- Importance & tagging system
- Comprehensive documentation
- Import/Export with template

### 🔮 **Future (v2.1+)**
- [ ] Bulk edit operations
- [ ] Advanced filters (combine multiple criteria)
- [ ] Memory timeline view
- [ ] Statistics dashboard
- [ ] Duplicate detection
- [ ] Reminder system for temporary entries
- [ ] AI-assisted suggestions

---

## 📝 License

Private project - For personal use only

---

## 💖 Credits

Built with love for Nazwan & Pasya 💕

**Technologies:**
- [Next.js](https://nextjs.org)
- [Ollama](https://ollama.ai)
- [SQLite](https://sqlite.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

---

**Last Updated:** January 2025  
**Version:** 2.0 (Comprehensive Memory System)
**Status:** ✅ Production Ready

---

## 🚀 Quick Links

- 📱 [Chat Interface](http://localhost:3000/chat)
- 🧠 [Memory Management](http://localhost:3000/memories)
- 🎁 [Surprise Messages](http://localhost:3000/surprise)
- 📖 [Documentation](./MEMORY_GUIDE.md)
- 📋 [Quick Reference](./QUICK_REFERENCE.md)

