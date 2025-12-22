import {ArrowLeft, Plus} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import React from 'react';
import {useCreateItemForm} from './useCreateItemForm';
import {CreateItemForm} from './CreateItemForm';


export function CreateItemPage() {
    const navigate = useNavigate();
    const {formData, updateField, handleSubmit, isSubmitting} = useCreateItemForm();

    return (
        <div className="relative min-h-screen px-4 py-12">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{animationDelay: '1s'}}></div>
                <div
                    className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative max-w-2xl mx-auto">
                {/* Header */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/>
                        Back to Home
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-3">
                            <Plus className="w-8 h-8 text-white"/>
                        </div>
                        <h1 className="text-white">Create New Item</h1>
                    </div>

                    <p className="text-white/80">
                        Add a new product to your catalog. Fill in the details below.
                    </p>
                </div>

                {/* Form */}
                <CreateItemForm
                    formData={formData}
                    updateField={updateField}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
