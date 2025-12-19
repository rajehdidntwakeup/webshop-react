import { ArrowLeft, ShoppingBag, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext.tsx';

export function Orders() {
  const navigate = useNavigate();
  const { orders } = useOrders();

  return (
    <div className="relative min-h-screen px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-3">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white">Your Orders</h1>
          </div>
          
          <p className="text-white/80">
            View all your placed orders below. Total orders: {orders.length}
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h2 className="text-white mb-2">No orders yet</h2>
            <p className="text-white/70 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/products')}
              className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white mb-2">{order.productName}</h3>
                    <p className="text-white/70 text-sm">
                      Ordered on {order.orderedAt.toLocaleDateString()} at {order.orderedAt.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-white">{order.price}</span>
                    <div className="backdrop-blur-md bg-green-500/30 border border-green-400/50 text-green-200 px-4 py-2 rounded-xl flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Ordered
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
