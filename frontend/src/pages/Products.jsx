import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Données de test correspondant au design Figma
  const mockProducts = [
    {
      id: 1,
      name: 'Produit Premium',
      price: 299,
      image: 'https://images.unsplash.com/photo-1523275335684-e3db6f7b5a5c?w=500&h=500&fit=crop',
      category: 'premium',
      description: 'Produit de haute qualité avec finition premium'
    },
    {
      id: 2,
      name: 'Produit Standard',
      price: 199,
      image: 'https://images.unsplash.com/photo-1572635146650-1e98e9b5e4c5?w=500&h=500&fit=crop',
      category: 'standard',
      description: 'Produit fiable et abordable'
    },
    {
      id: 3,
      name: 'Produit Elite',
      price: 499,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop',
      category: 'elite',
      description: 'Notre produit le plus exclusif'
    },
    {
      id: 4,
      name: 'Produit Classic',
      price: 149,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&h=500&fit=crop',
      category: 'classic',
      description: 'Design classique et intemporel'
    },
    {
      id: 5,
      name: 'Produit Sport',
      price: 349,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      category: 'sport',
      description: 'Parfait pour les activités sportives'
    },
    {
      id: 6,
      name: 'Produit Pro',
      price: 599,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
      category: 'pro',
      description: 'Version professionnelle avec fonctionnalités avancées'
    }
  ]

  useEffect(() => {
    // Simuler le chargement
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'premium', 'standard', 'elite', 'classic', 'sport', 'pro']

  const addToCart = (productId) => {
    console.log('Ajout au panier:', productId)
    // TODO: Implémenter la logique du panier
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne correspondant au design Figma */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-red-600">
                RED Product
              </Link>
            </div>
            <nav className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                Accueil
              </Link>
              <Link 
                to="/products" 
                className="text-red-600 font-medium"
              >
                Produits
              </Link>
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section exactement comme dans Figma */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Découvrez nos produits
              <span className="block text-red-200">d'exception</span>
            </h1>
            <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
              Une sélection unique de produits conçus pour vous offrir la meilleure expérience possible.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres et recherche */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Recherche */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtre par catégorie */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes les catégories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grille de produits moderne comme dans Figma */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
                    {/* Image du produit avec aspect ratio carré */}
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23F3F4F6"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239CA3AF" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                    
                    {/* Contenu du produit */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Prix et bouton comme dans Figma */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">
                          {product.price}€
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm"
                        >
                          Ajouter au panier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default Products
