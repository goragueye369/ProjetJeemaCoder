import { useState, useEffect } from 'react'
import axios from 'axios'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulation de données produits pour le moment
    const mockProducts = [
      {
        id: 1,
        name: 'Product Premium',
        description: 'Produit de haute qualité avec caractéristiques avancées',
        price: 299.99,
        image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Product+1',
        category: 'Électronique'
      },
      {
        id: 2,
        name: 'Product Standard',
        description: 'Produit fiable et abordable pour usage quotidien',
        price: 149.99,
        image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Product+2',
        category: 'Maison'
      },
      {
        id: 3,
        name: 'Product Pro',
        description: 'Solution professionnelle pour les experts',
        price: 599.99,
        image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Product+3',
        category: 'Bureau'
      },
      {
        id: 4,
        name: 'Product Lite',
        description: 'Version légère et portable',
        price: 99.99,
        image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Product+4',
        category: 'Accessoires'
      },
      {
        id: 5,
        name: 'Product Max',
        description: 'Performance maximale pour les utilisateurs exigeants',
        price: 899.99,
        image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Product+5',
        category: 'Gaming'
      },
      {
        id: 6,
        name: 'Product Eco',
        description: 'Solution écologique et durable',
        price: 199.99,
        image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Product+6',
        category: 'Écologie'
      }
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des produits</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Produits</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de produits conçus pour répondre à tous vos besoins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">{product.price.toFixed(2)} €</span>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
