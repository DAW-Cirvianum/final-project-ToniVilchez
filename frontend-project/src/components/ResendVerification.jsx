import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {     
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Necessites iniciar sessió primer');
                navigate('/login');
                return;
            }

            const response = await api.post('/email/resend');
            
            setMessage(response.data.message || 'Correu de verificació reenviat!');
            
        } catch (err) {
            console.error('Error en reenviar verificació:', err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                setError('Sessió expirada. Torna a iniciar sessió.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError('Error en reenviar el correu. Torna-ho a provar.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reenviar Correu de Verificació
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        No has rebut el correu de verificació? Reenvia'l.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {loading ? 'Reenviant...' : 'Reenviar Correu de Verificació'}
                        </button>
                    </div>

                    {message && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {message}
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="text-center space-y-2">
                        <div>
                            <Link 
                                to="/login" 
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Tornar a iniciar sessió
                            </Link>
                        </div>
                        <div>
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Has oblidat la contrasenya?
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResendVerification;