import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import { api } from '../services/api';
import './dining.css';

export default function GetAndGo() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [filterTag, setFilterTag] = useState('all');

  useEffect(() => {
    Promise.all([api.getGetAndGoLocations(), api.getMealPlan()]).then(([locs, plan]) => {
      setLocations(locs);
      setMealPlan(plan);
      setLoading(false);
    });
  }, []);

  const selectLocation = useCallback(async (loc) => {
    setSelectedLocation(loc);
    setMenuLoading(true);
    setCart([]);
    setFilterTag('all');
    const data = await api.getGetAndGoMenu(loc.id);
    setMenuData(data);
    setMenuLoading(false);
  }, []);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === itemId);
      if (existing && existing.qty > 1) {
        return prev.map((c) => (c.id === itemId ? { ...c, qty: c.qty - 1 } : c));
      }
      return prev.filter((c) => c.id !== itemId);
    });
  }, []);

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartCalories = cart.reduce((sum, c) => sum + c.calories * c.qty, 0);

  const placeOrder = useCallback(async () => {
    if (cart.length === 0 || !selectedLocation) return;
    setOrdering(true);
    const result = await api.placeGetGoOrder(selectedLocation.id, cart);
    setOrdering(false);
    setOrderResult(result);
  }, [cart, selectedLocation]);

  // ORDER CONFIRMATION
  if (orderResult) {
    return (
      <div className="dining-page page-enter">
        <AppHeader title="Order Confirmed" showBack onBack={() => navigate('/dining')} />
        <div className="getgo-confirmation">
          <div className="gg-confirm-check">✅</div>
          <h2 className="gg-confirm-title">Order Placed!</h2>
          <p className="gg-confirm-id">Order #{orderResult.orderId}</p>
          <div className="gg-confirm-card widget-card">
            <div className="gg-confirm-row">
              <span>📍 Pickup at</span>
              <strong>{selectedLocation.name}</strong>
            </div>
            <div className="gg-confirm-row">
              <span>⏱️ Estimated</span>
              <strong>{orderResult.estimatedPickup}</strong>
            </div>
            <div className="gg-confirm-row">
              <span>🍽️ Items</span>
              <strong>{cartCount}</strong>
            </div>
            <div className="gg-confirm-row">
              <span>🔥 Total Calories</span>
              <strong>{cartCalories} cal</strong>
            </div>
          </div>
          <p className="gg-confirm-hint">
            You'll receive a notification when your order is ready for pickup
          </p>
          <div className="gg-confirm-items">
            {cart.map((item) => (
              <div className="gg-confirm-item" key={item.id}>
                <span>{item.qty}× {item.name}</span>
                <span className="gg-confirm-cal">{item.calories * item.qty} cal</span>
              </div>
            ))}
          </div>
          <button className="gg-done-btn" onClick={() => navigate('/dining')}>
            Done
          </button>
        </div>
      </div>
    );
  }

  // MENU VIEW
  if (selectedLocation && menuData) {
    const allTags = new Set();
    menuData.menu.forEach((cat) =>
      cat.items.forEach((item) => item.tags.forEach((t) => allTags.add(t)))
    );

    return (
      <div className="dining-page page-enter">
        <AppHeader
          title={selectedLocation.name}
          showBack
          onBack={() => {
            setSelectedLocation(null);
            setMenuData(null);
            setCart([]);
          }}
        />
        <div className="scroll-content">
          {/* Location info bar */}
          <div className="gg-loc-info">
            <span className="gg-loc-hours">🕐 {selectedLocation.hours}</span>
            <span className="gg-loc-pickup">⏱️ {selectedLocation.pickupTime}</span>
            {mealPlan && (
              <span className="gg-loc-swipes">
                🍽️ {mealPlan.getAndGo.perDay - mealPlan.getAndGo.usedToday} GET&GO left today
              </span>
            )}
          </div>

          {/* Filter tags */}
          {allTags.size > 0 && (
            <div className="gg-tag-filters">
              <button
                className={`gg-tag ${filterTag === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTag('all')}
              >
                All
              </button>
              {[...allTags].map((tag) => (
                <button
                  key={tag}
                  className={`gg-tag ${filterTag === tag ? 'active' : ''}`}
                  onClick={() => setFilterTag(tag)}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          )}

          {menuLoading ? (
            <div className="dining-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />
              ))}
            </div>
          ) : (
            menuData.menu.map((cat) => {
              const filteredItems =
                filterTag === 'all'
                  ? cat.items
                  : cat.items.filter((item) => item.tags.includes(filterTag));
              if (filteredItems.length === 0) return null;

              return (
                <div key={cat.category} className="gg-menu-section">
                  <div className="gg-menu-cat">{cat.category}</div>
                  {filteredItems.map((item) => {
                    const inCart = cart.find((c) => c.id === item.id);
                    return (
                      <div className="gg-menu-item" key={item.id}>
                        <div className="gg-item-info">
                          <div className="gg-item-name-row">
                            <span className="gg-item-name">{item.name}</span>
                            {item.tags.includes('popular') && <span className="gg-popular-tag">🔥</span>}
                          </div>
                          <p className="gg-item-desc">{item.description}</p>
                          <div className="gg-item-meta">
                            <span className="gg-item-cal">{item.calories} cal</span>
                            {item.allergens.length > 0 && (
                              <span className="gg-item-allergens">
                                ⚠️ {item.allergens.join(', ')}
                              </span>
                            )}
                          </div>
                          {item.tags.filter(t => t !== 'popular').length > 0 && (
                            <div className="gg-item-tags">
                              {item.tags.filter(t => t !== 'popular').map((t) => (
                                <span key={t} className={`gg-item-tag ${t}`}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="gg-item-action">
                          {inCart ? (
                            <div className="gg-qty-control">
                              <button className="gg-qty-btn" onClick={() => removeFromCart(item.id)}>
                                –
                              </button>
                              <span className="gg-qty">{inCart.qty}</span>
                              <button className="gg-qty-btn" onClick={() => addToCart(item)}>
                                +
                              </button>
                            </div>
                          ) : (
                            <button className="gg-add-btn" onClick={() => addToCart(item)}>
                              + Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}

          {/* Spacer for cart bar */}
          {cart.length > 0 && <div style={{ height: 80 }} />}
        </div>

        {/* Cart bar */}
        {cart.length > 0 && (
          <div className="gg-cart-bar">
            <div className="gg-cart-info">
              <span className="gg-cart-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
              <span className="gg-cart-cal">{cartCalories} cal</span>
            </div>
            <button className="gg-cart-btn" onClick={placeOrder} disabled={ordering}>
              {ordering ? (
                <span className="spinner" style={{ width: 18, height: 18 }} />
              ) : (
                <>Place Order — Meal Swipe</>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // LOCATION SELECTION
  return (
    <div className="dining-page page-enter">
      <AppHeader title="GET & GO" showBack onBack={() => navigate('/dining')} />
      <div className="scroll-content">
        <div className="gg-hero">
          <div className="gg-hero-icon">📱</div>
          <h2 className="gg-hero-title">GET & GO Mobile Ordering</h2>
          <p className="gg-hero-desc">
            Order ahead and pick up when it's ready. Use your meal swipes — no waiting in line!
          </p>
          {mealPlan && (
            <div className="gg-hero-balance">
              <span>🍽️ {mealPlan.getAndGo.perDay - mealPlan.getAndGo.usedToday} of {mealPlan.getAndGo.perDay} GET & GO swipes available today</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="dining-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 90, borderRadius: 12 }} />
            ))}
          </div>
        ) : (
          <>
            <div className="section-label" style={{ padding: '0 var(--space-lg)' }}>
              Choose a Location
            </div>
            {locations.map((loc) => (
              <button
                key={loc.id}
                className={`gg-location-card ${loc.status !== 'open' ? 'closed' : ''}`}
                onClick={() => loc.status === 'open' && selectLocation(loc)}
                disabled={loc.status !== 'open'}
              >
                <div className="gg-loc-left">
                  <div className="gg-loc-icon">🍔</div>
                </div>
                <div className="gg-loc-main">
                  <span className="gg-loc-name">{loc.name}</span>
                  <span className="gg-loc-building">{loc.building}</span>
                  <div className="gg-loc-bottom">
                    <span className={`gg-loc-status ${loc.status}`}>
                      {loc.status === 'open' ? '● Open' : '○ Closed'}
                    </span>
                    <span className="gg-loc-hrs">{loc.hours}</span>
                  </div>
                </div>
                <div className="gg-loc-right">
                  {loc.status === 'open' && (
                    <>
                      <span className="gg-loc-eta">{loc.pickupTime}</span>
                      <span className="gg-loc-arrow">›</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
