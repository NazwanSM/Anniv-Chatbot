'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Card from '@/components/Card';

type Memory = {
    key: string;
    value: string;
    category?: string;
    who?: string;
    confidence?: number;
    source?: string;
    tags?: string;
    importance?: number;
    updatedAt?: string;
};

const CATEGORIES = [
    { value: 'personal', label: '👤 Personal', color: 'bg-blue-100 text-blue-700' },
    { value: 'relationship', label: '💑 Relationship', color: 'bg-pink-100 text-pink-700' },
    { value: 'preferences', label: '⭐ Preferences', color: 'bg-purple-100 text-purple-700' },
    { value: 'places', label: '📍 Places', color: 'bg-green-100 text-green-700' },
    { value: 'emotional', label: '❤️ Emotional', color: 'bg-red-100 text-red-700' },
    { value: 'communication', label: '💬 Communication', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'inside_jokes', label: '😄 Inside Jokes', color: 'bg-orange-100 text-orange-700' },
    { value: 'special_moments', label: '✨ Special Moments', color: 'bg-rose-100 text-rose-700' },
    { value: 'goals', label: '🎯 Goals', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'current_context', label: '📌 Current', color: 'bg-teal-100 text-teal-700' },
    { value: 'general', label: '📝 General', color: 'bg-gray-100 text-gray-700' },
];

export default function MemoriesPage() {
    const [items, setItems] = useState<Memory[]>([]);
    const [filteredItems, setFilteredItems] = useState<Memory[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [formData, setFormData] = useState({ 
        key: '', 
        value: '', 
        category: 'general',
        who: 'partner',
        importance: 3,
        tags: ''
    });
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMemories = async () => {
        try {
            const res = await fetch('/api/memories');
            const data = await res.json();
            if (data.success) {
                setItems(data.data);
                setFilteredItems(data.data);
            }
        } catch (error) {
            console.error('Error fetching memories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    useEffect(() => {
        let filtered = items;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.key.toLowerCase().includes(query) ||
                item.value.toLowerCase().includes(query) ||
                item.tags?.toLowerCase().includes(query)
            );
        }

        setFilteredItems(filtered);
    }, [items, selectedCategory, searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.key || !formData.value) return;

        try {
            const res = await fetch('/api/memories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: formData.key,
                    value: formData.value,
                    category: formData.category,
                    who: formData.who,
                    importance: formData.importance,
                    tags: formData.tags
                })
            });
            const data = await res.json();
            
            if (data.success) {
                await fetchMemories();
                setFormData({ 
                    key: '', 
                    value: '', 
                    category: 'general',
                    who: 'partner',
                    importance: 3,
                    tags: ''
                });
                setShowForm(false);
                setEditingKey(null);
            } else {
                alert(data.error || 'Failed to save memory');
            }
        } catch (error) {
            console.error('Error saving memory:', error);
            alert('Failed to save memory');
        }
    };

    const handleDelete = async (key: string) => {
        if (!confirm(`Hapus memory "${key}"?`)) return;

        try {
            const res = await fetch(`/api/memories/${key}`, { method: 'DELETE' });
            const data = await res.json();
            
            if (data.success) {
                await fetchMemories();
            } else {
                alert(data.error || 'Failed to delete memory');
            }
        } catch (error) {
            console.error('Error deleting memory:', error);
            alert('Failed to delete memory');
        }
    };

    const handleEdit = (item: Memory) => {
        setFormData({ 
            key: item.key, 
            value: item.value,
            category: item.category || 'general',
            who: item.who || 'partner',
            importance: item.importance || 3,
            tags: item.tags || ''
        });
        setEditingKey(item.key);
        setShowForm(true);
    };

    const predefinedKeys = [
        { key: 'favorite_food', label: 'Makanan Favorit' },
        { key: 'favorite_drink', label: 'Minuman Favorit' },
        { key: 'favorite_color', label: 'Warna Favorit' },
        { key: 'place_fav', label: 'Tempat Favorit' },
        { key: 'hobby_fav', label: 'Hobi Favorit' },
        { key: 'anniversary_date', label: 'Tanggal Anniversary' }
    ];

    const handleExport = async () => {
        try {
            const res = await fetch('/api/memories/export');
            const data = await res.json();
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `memories-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting:', error);
            alert('Failed to export memories');
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            const res = await fetch('/api/memories/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await res.json();
            if (result.success) {
                alert(result.message);
                await fetchMemories();
            } else {
                alert(result.error || 'Failed to import');
            }
        } catch (error) {
            console.error('Error importing:', error);
            alert('Failed to import memories. Make sure the file format is correct.');
        }
    };

    return (
        <>
            <Header title="Our Memories" subtitle="Hal-hal kecil yang kamu sukai" />
            
            <Card className="p-3 sm:p-4">
                {/* Toolbar */}
                <div className="mb-4 flex gap-2">
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingKey(null);
                            setFormData({ 
                                key: '', 
                                value: '', 
                                category: 'general',
                                who: 'partner',
                                importance: 3,
                                tags: ''
                            });
                        }}
                        className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition"
                    >
                        {showForm ? '✕ Batal' : '+ Tambah Memory'}
                    </button>
                    <button
                        onClick={handleExport}
                        className="py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-500 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition text-sm sm:text-base"
                        title="Export to JSON"
                    >
                        📥
                    </button>
                    <label className="py-2 sm:py-2.5 px-3 sm:px-4 bg-green-500 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition cursor-pointer text-sm sm:text-base" title="Import from JSON">
                        📤
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Search & Filter */}
                <div className="mb-4 space-y-3">
                    <input
                        type="text"
                        placeholder="🔍 Search memories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:border-pink-400 transition"
                    />
                    
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                                selectedCategory === 'all' 
                                    ? 'bg-gray-700 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All ({items.length})
                        </button>
                        {CATEGORIES.map(cat => {
                            const count = items.filter(item => item.category === cat.value).length;
                            return (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                                        selectedCategory === cat.value
                                            ? cat.color
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="hidden sm:inline">{cat.label}</span>
                                    <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                                    <span className="ml-1">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="mb-4 p-4 bg-rose-50/50 rounded-xl space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Key {!editingKey && <span className="text-xs text-slate-500">(atau pilih dari preset)</span>}
                                    </label>
                                    {editingKey ? (
                                        <input
                                            type="text"
                                            value={formData.key}
                                            disabled
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500"
                                        />
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                value={formData.key}
                                                onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                                placeholder="e.g., favorite_movie"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                                            />
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {predefinedKeys.map(pk => (
                                                    <button
                                                        key={pk.key}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, key: pk.key })}
                                                        className="text-xs px-3 py-1 bg-white border border-pink-200 text-pink-700 rounded-full hover:bg-pink-50 transition"
                                                    >
                                                        {pk.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                                    <input
                                        type="text"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        placeholder="e.g., Sushi"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Who</label>
                                        <select
                                            value={formData.who}
                                            onChange={(e) => setFormData({ ...formData, who: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                                        >
                                            <option value="partner">Partner (Pasya)</option>
                                            <option value="self">Self (Me)</option>
                                            <option value="both">Both of Us</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Importance: {'⭐'.repeat(formData.importance)}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={formData.importance}
                                        onChange={(e) => setFormData({ ...formData, importance: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Tags <span className="text-xs text-slate-500">(comma-separated)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="e.g., food, restaurant, romantic"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-md transition"
                                >
                                    {editingKey ? '💾 Update Memory' : '✨ Simpan Memory'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* List */}
                {loading ? (
                    <div className="p-6 text-center text-slate-500">Loading...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                        No memories found matching your search.
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-200/70">
                        {filteredItems.map(it => {
                            const category = CATEGORIES.find(c => c.value === it.category);
                            return (
                                <motion.li
                                    key={it.key}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-3 flex items-start justify-between gap-3"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium capitalize">{it.key.replaceAll('_', ' ')}</span>
                                            {category && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${category.color}`}>
                                                    {category.label}
                                                </span>
                                            )}
                                            {it.importance && (
                                                <span className="text-xs">
                                                    {'⭐'.repeat(it.importance)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[13px] text-slate-600">{it.value}</div>
                                        {it.tags && (
                                            <div className="flex gap-1 mt-1">
                                                {it.tags.split(',').map((tag, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                        #{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="text-[11px] text-slate-400 mt-1">
                                            {it.who && <span className="mr-2">👤 {it.who}</span>}
                                            {it.source && <span className="mr-2">📝 {it.source}</span>}
                                            {it.updatedAt?.replace('T', ' ').slice(0, 16)}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(it)}
                                            className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(it.key)}
                                            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </motion.li>
                            );
                        })}
                    </ul>
                )}
            </Card>

            <div className="mt-3 flex flex-col items-center gap-2">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-pink-500 transition"
                >
                    <span>←</span>
                    <span>Kembali ke Home</span>
                </Link>
                <div className="text-center text-xs text-slate-500 space-y-1">
                    <div>💡 Tip: Use categories & importance to organize memories better</div>
                    <div>🔍 Search by key, value, or tags | 🏷️ Filter by category</div>
                    <div>📥 Export untuk backup | 📤 Import comprehensive-template.json</div>
                </div>
            </div>
        </>
    );
}
